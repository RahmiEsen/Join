import {
  Injectable, ForbiddenException, NotFoundException, BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService
  ) {}

  async signup(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash, name: dto.name },
    });
    return { message: 'User created', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new ForbiddenException('Login fehlgeschlagen');
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { access_token: token };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });
    
    if (!user) throw new BadRequestException('Invalid or expired token');
    
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('SAME_PASSWORD'); // Einheitlicher Fehlercode
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashed, 
        resetToken: null, 
        resetTokenExpiry: null 
      },
    });
    
    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Nutzer nicht gefunden');
    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60);
    await this.prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
    const resetLink = `http://localhost:4200/reset-password?token=${token}`;
    await this.mailService.sendResetEmail(email, resetLink);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async setResetToken(email: string, token: string) {
    const expiry = new Date(Date.now() + 1000 * 60 * 60);
    await this.prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
  }

  async generateToken(payload: { sub: string; email: string }) {
    return this.jwt.signAsync(payload);
  }

  async validateOAuthLogin(profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (existingUser) return existingUser;

      const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();

      const user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: fullName || profile.email, // Falls name leer ist
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          picture: profile.picture ?? '',
          provider: 'google',
        },
      });

      console.log('🆕 Neuer User gespeichert:', user);
      return user;
    } catch (error) {
      console.error('❌ Fehler beim Speichern des Google-Nutzers:', error);
      throw error;
    }
  }
}