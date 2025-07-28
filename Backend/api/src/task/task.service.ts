import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, ChecklistDto  } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  private readonly _includeRelations: Prisma.TaskInclude = {
    labels: true,
    members: true,
    checklists: {
      include: { items: true },
    },
    owner: true, 
  };

  async create(dto: CreateTaskDto) {
    const { ownerId, labelIds, memberIds, checklists, ...taskData } = dto;
    const data: Prisma.TaskCreateInput = {
      ...taskData,
      isGuest: taskData.isGuest ?? false,
    };
    if (ownerId) {
      data.owner = { connect: { id: ownerId } };
    }
    if (labelIds?.length) {
      data.labels = { connect: labelIds.map((id) => ({ id })) };
    }
    if (memberIds?.length) {
      data.members = { connect: memberIds.map((id) => ({ id })) };
    }
    if (checklists?.length) {
      data.checklists = this._prepareChecklistData(checklists);
    }
    return this.prisma.task.create({
      data,
      include: this._includeRelations,
    });
  }

  async findAllForUser(userId: string) {
    return this._findMany({ ownerId: userId, isGuest: false });
  }

  async findAllForGuest() {
    return this._findMany({ isGuest: true });
  }

  private _findMany(where: Prisma.TaskWhereInput) {
    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: this._includeRelations,
    });
  }

  private _prepareChecklistData(
    checklists: ChecklistDto[],
  ): Prisma.ChecklistCreateNestedManyWithoutTaskInput {
    return {
      create: checklists.map((checklist) => ({
        title: checklist.title,
        items: {
          create: checklist.items.map((item) => ({
            text: item.text,
            isCompleted: item.isCompleted ?? false,
          })),
        },
      })),
    };
  }
}