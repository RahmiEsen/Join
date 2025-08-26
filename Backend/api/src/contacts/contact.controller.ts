import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
  
  @Post()
  @UseInterceptors(FileInterceptor('profilePicture'))
  create(
    @Body() createContactDto: CreateContactDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createContactDto.profilePicture = file.path.replace(/\\/g, '/');
    }
    return this.contactService.create(createContactDto);
  }
  
  @Get('guest')
  getGuestContacts() {
    return this.contactService.getGuestContacts();
  }
  
  @Get('user/:userId')
  getUserContacts(@Param('userId') userId: string) {
    return this.contactService.getContactsByUser(userId);
  }
  
  @Delete(':id')
  deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(id);
  }
  
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profilePicture'))
  updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateContactDto.profilePicture = file.path.replace(/\\/g, '/');
    }
    return this.contactService.update(id, updateContactDto);
  }
}