import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getGuestContacts() {
    return this.prisma.contact.findMany({
      where: { isGuestVisible: true },
    });
  }
}
