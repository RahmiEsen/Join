import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskListDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}