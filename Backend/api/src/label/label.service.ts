import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from '@prisma/client';

@Injectable()
export class LabelService {
    constructor(private prisma: PrismaService) {}
    
    async create(createLabelDto: CreateLabelDto): Promise<Label> {
        const { title, color, ownerId, isGuest } = createLabelDto;
        const data: any = {
            title,
            color,
            isGuest: isGuest ?? false,
        };
        if (ownerId) {
            const user = await this.prisma.user.findUnique({ where: { id: ownerId } });
            if (!user) {
            throw new NotFoundException(`User with ID ${ownerId} not found.`);
            }
            data.owner = { connect: { id: ownerId } };
        }
        return this.prisma.label.create({ data });
    }
    
    findAllForUser(userId: string) {
        return this.prisma.label.findMany({
        where: { ownerId: userId },
        orderBy: { title: 'asc' },
        });
    }
    
    findAllGuestLabels() {
    return this.prisma.label.findMany({
        where: { isGuest: true },
        orderBy: { title: 'asc' },
    });
    }
    
    async update(id: string, updateLabelDto: UpdateLabelDto) {
        try {
        return await this.prisma.label.update({
            where: { id },
            data: updateLabelDto,
        });
        } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Label with ID ${id} not found.`);
        }
        throw error;
        }
    }
    
    async remove(id: string) {
        try {
        await this.prisma.label.delete({ where: { id } });
        return { message: `Label with ID ${id} successfully deleted.` };
        } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Label with ID ${id} not found.`);
        }
        throw error;
        }
    }
}