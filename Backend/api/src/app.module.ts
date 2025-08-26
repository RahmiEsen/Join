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
import { TaskListModule } from './tasklist/tasklist.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UserModule, 
    MailModule, 
    ContactModule, 
    TaskModule,
    LabelModule,
    TaskListModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}