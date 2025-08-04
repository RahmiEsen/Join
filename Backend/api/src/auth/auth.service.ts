import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
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

    if (!user) {
      throw new ForbiddenException('EMAIL_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('WRONG_PASSWORD');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
      background: user.background, // Dieser Teil ist bereits korrekt
    };

    const token = await this.jwt.signAsync(payload);
    return { access_token: token };
  }

  async guestLogin(): Promise<{ access_token: string; user: any }> {
    const guestId = 'guest';
    let guest = await this.prisma.user.findUnique({
      where: { id: guestId },
    });
    if (!guest) {
      guest = await this.prisma.user.create({
        data: {
          id: guestId,
          name: 'Gast',
          email: 'gast@example.com',
          role: 'guest',
        },
      });
    }
    const payload = {
      sub: guest.id,
      role: guest.role,
      name: guest.name,
      background: guest.background, // HIER IST DIE KORREKTUR FÜR DEN GAST
    };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
    });
    return {
      access_token,
      user: guest,
    };
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
      throw new BadRequestException('SAME_PASSWORD');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Nutzer nicht gefunden');

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 Stunde

    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetLink = `http://localhost:4200/auth/reset-password?token=${token}`;
    await this.mailService.sendResetEmail(email, resetLink);
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

      const fullName = `${profile.firstName ?? ''} ${
        profile.lastName ?? ''
      }`.trim();

      const user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: fullName || profile.email,
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          picture: profile.picture ?? '',
          provider: 'google',
        },
      });

      return user;
    } catch (error) {
      console.error('❌ Fehler beim Google-Login:', error);
      throw error;
    }
  }

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload);
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
}