import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateTaskDto) {
        return this.prisma.task.create({ data });
    }

    async findAllForUser(userId: string) {
        return this.prisma.task.findMany({
        where: { ownerId: userId, isGuest: false },
        orderBy: { createdAt: 'desc' }
        });
    }

    async findAllForGuest() {
        return this.prisma.task.findMany({
        where: { isGuest: true },
        orderBy: { createdAt: 'desc' }
        });
    }
}