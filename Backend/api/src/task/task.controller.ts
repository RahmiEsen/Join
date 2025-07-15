import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto);
    }

    @Get()
    findAll(@Query('userId') userId?: string) {
        return userId
        ? this.taskService.findAllForUser(userId)
        : this.taskService.findAllForGuest();
    }
}