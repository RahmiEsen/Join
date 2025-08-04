import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(2048)
    background?: string;
}