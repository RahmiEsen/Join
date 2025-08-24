import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TaskListService } from './tasklist.service';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { UpdateTaskListDto } from './dto/update-tasklist.dto';
import { UpdateTaskListOrderDto } from './dto/update-tasklist-order.dto';

@Controller('tasklists')
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}
  
  /* @Get()
  findAll() {
    return this.taskListService.findAll();
  } */
  
  @Get('user/:userId')
  findAllForUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.taskListService.findAllForUser(userId);
  }
  
  @Get('guest')
  findAllForGuest() {
    return this.taskListService.findAllForGuest();
  }
  
  @Post()
  create(@Body() createTaskListDto: CreateTaskListDto) {
    return this.taskListService.create(createTaskListDto);
  }
  
  @Patch('order')
  updateOrder(@Body() updateTaskListOrderDto: UpdateTaskListOrderDto) {
    return this.taskListService.updateOrder(updateTaskListOrderDto.orderedIds);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskListDto: UpdateTaskListDto) {
    return this.taskListService.update(id, updateTaskListDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskListService.remove(id);
  }
}