import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
  
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
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
  updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto
  ) {
    return this.contactService.update(id, updateContactDto);
  }
}