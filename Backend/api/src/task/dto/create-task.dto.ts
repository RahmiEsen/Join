import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsISO8601,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChecklistItemDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

export class ChecklistDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  description?: any; // Besser: Prisma.JsonValue

  @IsOptional()
  @IsString()
  coverColor?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelIds?: string[];

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistDto)
  checklists?: ChecklistDto[];

  @IsOptional()
  @IsBoolean()
  isGuest?: boolean;

  @IsString()
  @IsOptional()
  taskListId?: string; // Um die Aufgabe einer anderen Liste zuzuordnen

  @IsNumber()
  @IsOptional()
  order?: number;
}