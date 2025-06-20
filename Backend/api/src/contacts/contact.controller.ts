import { Controller, Get } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('guest')
  getGuestContacts() {
    return this.contactService.getGuestContacts();
  }
}
