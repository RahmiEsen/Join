import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Controller('labels')
export class LabelController {
    constructor(private readonly labelService: LabelService) {}
    
    @Post()
    create(@Body() createLabelDto: CreateLabelDto) {
        return this.labelService.create(createLabelDto);
    }
    
    @Get('user/:userId')
    findAllForUser(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.labelService.findAllForUser(userId);
    }
    
    @Get('guest')
    findAllGuestLabels() {
        return this.labelService.findAllGuestLabels();
    }
    
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLabelDto: UpdateLabelDto) {
        return this.labelService.update(id, updateLabelDto);
    }
    
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.labelService.remove(id);
    }
}