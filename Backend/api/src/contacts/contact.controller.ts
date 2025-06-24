import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 🟢 Kontakt speichern (Gast oder User)
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  // 🟢 Gastkontakte abrufen
  @Get('guest')
  getGuestContacts() {
    return this.contactService.getGuestContacts();
  }

  // 🟢 Kontakte für bestimmten User
  @Get('user/:userId')
  getUserContacts(@Param('userId') userId: string) {
    return this.contactService.getContactsByUser(userId);
  }
}