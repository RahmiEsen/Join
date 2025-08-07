// src/tasklist/dto/update-task-list.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskListDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
}