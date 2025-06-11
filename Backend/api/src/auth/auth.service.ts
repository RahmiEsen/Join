import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
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
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  async signup(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
      },
    });
    return { message: 'User created', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new ForbiddenException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ForbiddenException('Wrong credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return { access_token: token };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new BadRequestException('Token ungültig oder abgelaufen');

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Passwort erfolgreich geändert' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Nutzer nicht gefunden');

    const token = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1h gültig
      },
    });

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;
    console.log('📧 Reset-Link:', resetLink); // Für Testzwecke

    await this.mailService.sendResetEmail(user.email, resetLink);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async setResetToken(email: string, token: string) {
    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
  }

  generateToken(payload: { sub: string; email: string }) {
    return this.jwtService.sign(payload);
  }

  findOrCreate(userData: {
    email: string;
    name: string;
    picture: string;
  }) {
    let user =  this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!user) {
      user =  this.prisma.user.create({
        data: {
          email: userData.email,
          name: userData.email,
          picture: userData.picture,
          provider: 'google',
        },
      });
    }
    return user;
  }
}