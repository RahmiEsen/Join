import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

const jwtModuleConfiguration = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  }),
};

const moduleImports = [
  ConfigModule.forRoot({ isGlobal: true }),
  MailModule,
  PassportModule,
  JwtModule.registerAsync(jwtModuleConfiguration),
];

const moduleProviders = [
  AuthService,
  JwtStrategy,
  GoogleStrategy,
  MailService,
  UserService,
  PrismaService,
];

@Module({
  imports: moduleImports,
  controllers: [AuthController],
  providers: moduleProviders,
})

export class AuthModule {}