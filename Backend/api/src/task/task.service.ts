import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, ChecklistDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  
  async update(id: string, dto: UpdateTaskDto) {
    const { ownerId, labelIds, memberIds, checklists, ...taskData } = dto;
    const data: Prisma.TaskUpdateInput = { ...taskData };
    if (ownerId) {
      data.owner = { connect: { id: ownerId } };
    }
    if (labelIds) {
      data.labels = { set: labelIds.map((id) => ({ id })) };
    }
    if (memberIds) {
      data.members = { set: memberIds.map((id) => ({ id })) };
    }
    if (checklists) {
      await this.prisma.checklist.deleteMany({ where: { taskId: id } });
      data.checklists = this._prepareChecklistData(checklists);
    }
    return this.prisma.task.update({
      where: { id },
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
          // Die Änderung stellt sicher, dass der Code nicht abstürzt,
          // wenn eine Checklist keine 'items' hat.
          create: (checklist.items ?? []).map((item) => ({
            text: item.text,
            isCompleted: item.isCompleted ?? false,
          })),
        },
      })),
    };
  }
  
  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    await this.prisma.checklist.deleteMany({
      where: { taskId: id },
    });
    return this.prisma.task.delete({
      where: { id },
    });
  }
}