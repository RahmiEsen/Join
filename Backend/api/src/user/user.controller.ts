import { Controller, Get, Req, UseGuards, Patch, Body } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Req() req): User {
        return req.user;
    }
    
    @UseGuards(JwtGuard)
    @Patch('me/background')
    updateUserBackground(
        @Req() req,
        @Body() dto: UpdateUserDto,
    ): Promise<User> {
        // HIER IST DIE KORREKTUR:
        const userId = req.user.sub; // 'sub' aus dem JWT-Payload verwenden

        return this.userService.updateBackground(userId, dto);
    }
}