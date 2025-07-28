import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}
    
    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto);
    }
    
    @Get('user/:userId')
    findAllForUser(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.taskService.findAllForUser(userId);
    }
    
    @Get('guest')
    findAllForGuest() {
        return this.taskService.findAllForGuest();
    }
}