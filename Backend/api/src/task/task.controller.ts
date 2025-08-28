import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Patch, Delete, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

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
    
    @UseGuards(AuthGuard('jwt'))
    @Get('user/images')
    findAllUserImages(@Req() req) {
        const userId = req.user.id;
        return this.taskService.findAllUserImages(userId);
    }
    
    @Get('guest')
    findAllForGuest() {
        return this.taskService.findAllForGuest();
    }
    
    @Get('guest/images')
    findAllGuestImages() {
        return this.taskService.findAllGuestImages();
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.taskService.remove(id);
    }
}