import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get, 
  Req, 
  UseGuards,
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('request-reset')
  async requestReset(@Body('email') email: string) {
    console.log('📥 E-Mail empfangen für Reset:', email);

    const user = await this.authService.findUserByEmail(email);
    if (!user) throw new NotFoundException('Nutzer nicht gefunden');

    const token = randomBytes(32).toString('hex');

    await this.authService.setResetToken(email, token);

    const link = `http://localhost:4200/reset-password?token=${token}`;
    console.log('🔗 Reset-Link:', link);

    await this.mailService.sendResetEmail(email, link);

    return { message: 'Reset-Mail gesendet' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string }
  ) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Leitet zu Google weiter
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: false }) res: Response
  ) {
    const user = req.user as any;
    const token = user.token;

    res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
  }
}