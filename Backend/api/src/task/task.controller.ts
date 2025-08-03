import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}
    
    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto);
    }
    
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.taskService.update(id, updateTaskDto);
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