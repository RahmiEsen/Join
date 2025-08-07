// src/tasklist/tasklist.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { UpdateTaskListDto } from './dto/update-tasklist.dto';


@Injectable()
export class TaskListService {
  constructor(private prisma: PrismaService) {}

  // Holt alle Listen und schließt die Tasks & deren Relationen mit ein
  findAll() {
    return this.prisma.taskList.findMany({
      include: {
        tasks: { // Für jede Liste, lade die zugehörigen Tasks
          orderBy: {
            createdAt: 'asc', // Optional: Tasks innerhalb sortieren
          },
          include: {
            members: true, // ... und für jeden Task die Mitglieder
            labels: true,  // ... und die Labels
          },
        },
      },
      orderBy: {
        createdAt: 'asc' // Optional: Die Listen selbst sortieren
      }
    });
  }

  // Platzhalter für zukünftige Funktionen
  create(createTaskListDto: CreateTaskListDto) {
    return this.prisma.taskList.create({
      data: createTaskListDto,
    });
  }

  update(id: string, updateTaskListDto: UpdateTaskListDto) {
    return this.prisma.taskList.update({
      where: { id: id },
      data: updateTaskListDto,
    });
  }
}