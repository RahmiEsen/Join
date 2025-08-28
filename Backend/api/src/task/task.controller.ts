import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Patch, Delete, HttpCode, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}
    
    @Post()
    @UseInterceptors(FileInterceptor('coverImage')) // Fängt die Datei mit dem Schlüssel 'coverImage' ab
    create(
      @Body() createTaskDto: CreateTaskDto,
      @UploadedFile() file: Express.Multer.File, // Die hochgeladene Datei wird hier injiziert
    ) {
        // Die Datei-Informationen (falls vorhanden) an den Service weitergeben
        if (file) {
          createTaskDto.coverImage = file.path; // Speichere den Pfad
        }
        return this.taskService.create(createTaskDto);
    }
    
    @Patch(':id')
    @UseInterceptors(FileInterceptor('coverImage')) // Auch hier den Interceptor verwenden
    update(
      @Param('id', ParseUUIDPipe) id: string, 
      @Body() updateTaskDto: UpdateTaskDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
        if (file) {
          updateTaskDto.coverImage = file.path; // Speichere den Pfad
        }
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
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.taskService.remove(id);
    }
}