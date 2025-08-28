import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express'; // Importieren

@Module({
  imports: [
    PrismaModule,
    // Multer hier registrieren
    MulterModule.register({
      dest: './uploads', // Definiert den Speicherort für hochgeladene Dateien
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}