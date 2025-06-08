import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('user')

export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Req() req) {
        return req.user;
    }
}