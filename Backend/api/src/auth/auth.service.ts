import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';

@Injectable()

export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}
    
    async signup(dto: SignupDto) {
        console.log('✅ Signup aufgerufen mit:', dto);
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
            email: dto.email,
            password: hash,
            firstname: dto.firstname,
            lastname: dto.lastname,
            },
        });

        return { message: 'User created', userId: user.id };
    }
    
    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
        where: { email },
        });
        
        if (!user) throw new ForbiddenException('User not found');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new ForbiddenException('Wrong credentials');
        
        const payload = { sub: user.id, email: user.email };
        const token = await this.jwt.signAsync(payload);
        
        return { access_token: token };
    }
}