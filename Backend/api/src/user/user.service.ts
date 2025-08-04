import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

interface OAuthUserData {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  
  async findOrCreate(userData: OAuthUserData): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) return existingUser;
    return this.createGoogleUser(userData);
  }
  
  private async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  
  private async createGoogleUser(data: OAuthUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        picture: data.picture,
        provider: 'google',
      },
    });
  }
  
  async updateBackground(userId: string, dto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          background: dto.background,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
      throw error;
    }
  }
}