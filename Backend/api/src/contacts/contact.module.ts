import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/profile-pictures',
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})

export class ContactModule {}