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
      callbackURL: 'https://join-backend-flax.vercel.app/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const user = await this.userService.findOrCreate({
      email: profile.emails?.[0]?.value,
      firstName: profile.name?.givenName ?? '',
      lastName: profile.name?.familyName ?? '',
      picture: profile.photos?.[0]?.value ?? '',
    });
    const token = await this.authService.generateToken({
      sub: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: 'user',
      picture: user.picture,
    });
    console.log('🧪 Token-Typ:', typeof token);
    console.log('🧪 Token:', token);
    done(null, {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      picture: user.picture,
      token,
    });
  }
}