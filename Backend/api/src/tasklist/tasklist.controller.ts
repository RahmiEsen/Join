// src/tasklist/tasklist.controller.ts
import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TaskListService } from './tasklist.service';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { UpdateTaskListDto } from './dto/update-tasklist.dto';

@Controller('tasklists')
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Get()
  findAll() {
    return this.taskListService.findAll();
  }

  @Post()
  create(@Body() createTaskListDto: CreateTaskListDto) {
    return this.taskListService.create(createTaskListDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskListDto: UpdateTaskListDto) {
    return this.taskListService.update(id, updateTaskListDto);
  }
}