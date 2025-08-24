import { IsArray, IsString } from 'class-validator';

export class UpdateTaskListOrderDto {
  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}