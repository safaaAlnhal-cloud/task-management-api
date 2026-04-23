import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    try {
      this.logger.log('Creating task...');

      const task = this.taskRepo.create(dto);
      const savedTask = await this.taskRepo.save(task);

      this.logger.log('Task created successfully');

      return savedTask;

    } catch (error: any) {

      if (
        error instanceof QueryFailedError &&
        (error as any).driverError?.code === '23505'
      ) {
        this.logger.error('Duplicate task title', error);

        throw new ConflictException('Task title already exists');
      }

      this.logger.error('Unexpected error', error);

      throw error;
    }
  }
}