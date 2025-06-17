import {
  Controller, Post, Body, Get, Req, Res,
  UseGuards, NotFoundException, ConflictException 
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const FRONTEND_URL = 'http://localhost:4200';
const RESET_EMAIL_SENT_MSG = 'Reset-Mail gesendet';
const USER_NOT_FOUND_MSG = 'Nutzer nicht gefunden';

interface GoogleUser {
  email: string;
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}
  
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('request-reset')
  async requestReset(@Body('email') email: string) {
    const user = await this.authService.findUserByEmail(email);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_MSG);
    const token = this.generateResetToken();
    const resetLink = this.createResetLink(token);
    await this.setTokenAndSendEmail(email, token, resetLink);
    return { message: RESET_EMAIL_SENT_MSG };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    try {
      return await this.authService.resetPassword(body.token, body.newPassword);
    } catch (error) {
      if (error.message.includes('SAME_PASSWORD')) {
        throw new ConflictException('You cannot use your previous password');
      }
      throw error;
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as GoogleUser;
    if (!user || !user.token) {
      throw new NotFoundException('User token not found');
    }
    const redirectUrl = this.createGoogleRedirectUrl(user.token);
    res.redirect(redirectUrl);
  }

  private generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  private createResetLink(token: string): string {
    return `${FRONTEND_URL}/auth/reset-password?token=${token}`;
  }

  private createGoogleRedirectUrl(token: string): string {
    return `${FRONTEND_URL}/auth-callback?token=${token}`;
  }

  private async setTokenAndSendEmail(
    email: string,
    token: string,
    link: string
  ): Promise<void> {
    await this.authService.setResetToken(email, token);
    await this.mailService.sendResetEmail(email, link);
  }
}