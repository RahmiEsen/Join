// src/tasklist/tasklist.module.ts
import { Module } from '@nestjs/common';
import { TaskListService } from './tasklist.service';
import { TaskListController } from './tasklist.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Wichtig für den Datenbankzugriff
  controllers: [TaskListController],
  providers: [TaskListService],
})
export class TaskListModule {}