import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    console.log('✅ Google-Profile:', profile);
    const user = await this.createOrFindUser(profile);
    const token = this.authService.generateToken({ sub: user.id, email: user.email });
    console.log('📥 Nutzer erfolgreich erstellt oder gefunden:', user.email);
    done(null, { ...user, token });
  }

  private async createOrFindUser(profile: any) {
    const { name, emails, photos } = profile;
    return this.userService.findOrCreate({
      email: emails?.[0]?.value,
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
      picture: photos?.[0]?.value ?? '',
    });
  }
}