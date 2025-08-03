import { IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateLabelDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    color: string;
    
    @IsString()
    @IsOptional()
    ownerId?: string;
    
    @IsBoolean()
    @IsOptional()
    isGuest?: boolean;
}