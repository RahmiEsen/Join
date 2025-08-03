import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contacts/contact.module';
import { TaskModule } from './task/task.module';
import { LabelModule } from './label/label.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UserModule, 
    MailModule, 
    ContactModule, 
    TaskModule,
    LabelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
