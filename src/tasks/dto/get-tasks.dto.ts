import { IsOptional, IsNumber, IsEnum , IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../task.entity';
export class GetTasksDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number= 0;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  
  @IsOptional()
  @IsString()
  search?: string;
  
}