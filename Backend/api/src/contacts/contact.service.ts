import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}
  
  async create(createContactDto: CreateContactDto) {
    const { ownerId, isGuest, ...rest } = createContactDto;
    const data: any = {
      ...rest,
      lastName: rest.lastName ?? '',
      isGuest: !!isGuest,
    };
    if (!ownerId) {
      data.ownerId = 'guest';
      data.isGuest = true;
    } else {
      const user = await this.prisma.user.findUnique({ where: { id: ownerId } });
      if (!user) throw new NotFoundException('User not found');
      data.ownerId = ownerId;
      data.isGuest = false;
    }
    return this.prisma.contact.create({ data });
  }
  
  async getGuestContacts() {
    return this.prisma.contact.findMany({
      where: { ownerId: 'guest' },
    });
  }
  
  async getContactsByUser(userId: string) {
    return this.prisma.contact.findMany({
      where: { ownerId: userId },
    });
  }
  
  async deleteContact(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}