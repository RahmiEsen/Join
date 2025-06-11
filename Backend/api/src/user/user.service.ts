import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Findet User anhand der E-Mail oder erstellt einen neuen Google-User
   */
  async findOrCreate(userData: OAuthUserData): Promise<user> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) return existingUser;
    return this.createGoogleUser(userData);
  }

  /**
   * Sucht Benutzer anhand der E-Mail-Adresse
   */
  private async findByEmail(email: string): Promise<user | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Erstellt einen neuen Benutzer mit Google-Daten
   */
  private async createGoogleUser(data: OAuthUserData): Promise<user> {
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
}

/**
 * Interface für OAuth-Nutzerdaten
 */
interface OAuthUserData {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}