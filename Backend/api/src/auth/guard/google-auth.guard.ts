import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
        throw err || new Error('Google Login fehlgeschlagen');
        }
        return user;
    }
}