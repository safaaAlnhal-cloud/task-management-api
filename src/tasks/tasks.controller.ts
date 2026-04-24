import { Controller, Post, Body, Get, Param, Query,ParseIntPipe , Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UserIdDto } from './dto/user-id.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Delete } from '@nestjs/common';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
    
  }
@Get()
findAll(@Query() query: GetTasksDto) {
  return this.tasksService.findAll(query);
}

@Get(':id')
findOne(@Param() params: UserIdDto ) {
  return this.tasksService.findOne(params.id);
}

@Patch(':id')
update(
  @Param()params: UserIdDto,
  @Body() dto: UpdateTaskDto,
) {
  return this.tasksService.update(params.id, dto);
}

@Delete(':id')
remove(@Param() params: UserIdDto ) {
  return this.tasksService.remove(params.id);
}



@Patch(':id/status')
updateStatus(
  @Param() params: UserIdDto,
  @Body() dto: UpdateTaskStatusDto,
) {
  return this.tasksService.updateStatus(params.id, dto);
}
  
}