import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { MailService } from '../mail/mail.service';


@Controller('auth')

export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly mailService: MailService
    ) {}
    
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }
    
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(
            dto.email, 
            dto.password
        );
    }
    
    @Post('request-reset')
    async requestReset(@Body('email') email: string) {
    console.log('📥 E-Mail empfangen für Reset:', email);

    const token = 'ABC123';
    const link = `http://localhost:4200/reset-password?token=${token}`;

    await this.mailService.sendResetEmail(email, link);

    return { message: 'Reset-Mail gesendet' };
    }

}