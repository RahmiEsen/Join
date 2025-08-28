import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsISO8601,
  IsNumber,
} from 'class-validator';
// Import the 'Transform' decorator
import { Type, Transform } from 'class-transformer';

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
  attachments?: any; // Besser: Prisma.JsonValue

  @IsOptional()
  @IsString()
  ownerId?: string;

  // ADDED @Transform
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
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

  // ADDED @Transform
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  // ADDED @Transform
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistDto)
  checklists?: ChecklistDto[];

  // ADDED @Transform to correctly handle 'true'/'false' strings
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
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