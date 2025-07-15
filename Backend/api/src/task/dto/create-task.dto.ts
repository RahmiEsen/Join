import { IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  coverColor?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  attachments?: any;

  @IsOptional()
  @IsString()
  ownerId?: string;
}
