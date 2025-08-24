import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { UpdateTaskListDto } from './dto/update-tasklist.dto';

@Injectable()
export class TaskListService {
  constructor(private prisma: PrismaService) {}
  
  findAllForUser(userId: string) {
    return this.prisma.taskList.findMany({
      where: {
        ownerId: userId,
        isGuest: false,
      },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
          include: { members: true, labels: true, checklists: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }
  
  async findAllForGuest() {
    const existingGuestLists = await this.prisma.taskList.findMany({
      where: { isGuest: true },
    });
    if (existingGuestLists.length === 0) {
      const defaultListTitles = ['To Do', 'In Progress', 'Awaiting Feedback', 'Done'];
      for (let i = 0; i < defaultListTitles.length; i++) {
        await this.prisma.taskList.create({
          data: {
            title: defaultListTitles[i],
            isGuest: true,
            order: i,
          },
        });
      }
    }
    return this.prisma.taskList.findMany({
      where: {
        isGuest: true,
      },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
          include: {
            members: true,
            labels: true,
            checklists: {
              include: {
                items: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }
  
  async updateOrder(orderedIds: string[]) {
    const transactions = orderedIds.map((id, index) => 
      this.prisma.taskList.update({
        where: { id: id },
        data: { order: index },
      })
    );
    return this.prisma.$transaction(transactions);
  }
  
  async create(createTaskListDto: CreateTaskListDto) {
    const count = await this.prisma.taskList.count({
      where: {
        ownerId: createTaskListDto.ownerId,
        isGuest: createTaskListDto.isGuest,
      },
    });
    return this.prisma.taskList.create({
      data: {
        ...createTaskListDto,
        order: count,
      },
    });
  }
  
  update(id: string, updateTaskListDto: UpdateTaskListDto) {
    return this.prisma.taskList.update({
      where: { id: id },
      data: updateTaskListDto,
    });
  }
  
  async remove(id: string) {
    return this.prisma.$transaction([
      this.prisma.task.deleteMany({
        where: { taskListId: id },
      }),
      this.prisma.taskList.delete({
        where: { id: id },
      }),
    ]);
  }
}