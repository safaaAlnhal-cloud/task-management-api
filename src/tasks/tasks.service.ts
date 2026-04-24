import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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

async findAll(query: GetTasksDto) {
  try {
     const { limit = 10, offset = 0 } = query;
    this.logger.log('Fetching all tasks');

    const tasks = await this.taskRepo.find({
      take: limit,
      skip: offset,
    });

    this.logger.log(`Fetched ${tasks.length} tasks`);

    return tasks;

  } catch (error) {
    this.logger.error('Failed to fetch tasks', error);
    throw error;
  }
}


async findOne(id: number) {
  try {
    this.logger.log(`Fetching task with id=${id}`);

    const task = await this.taskRepo.findOne({
      where: { id },
    });

    if (!task) {
      this.logger.warn(`Task not found id=${id}`);
      throw new NotFoundException('Task not found');
    }

    this.logger.log(`Task found id=${id}`);

    return task;

  } catch (error) {
    this.logger.error(`Error fetching task id=${id}`, error);
    throw error;
  }
}

async update(id: number, dto: UpdateTaskDto) {
  try {
    this.logger.log(`Updating task id=${id}`);

    const task = await this.taskRepo.findOne({
      where: { id },
    });

    if (!task) {
      this.logger.warn(`Task not found id=${id}`);
      throw new NotFoundException('Task not found');
    }

    const updatedTask = Object.assign(task, dto);

    const saved = await this.taskRepo.save(updatedTask);

    this.logger.log(`Task updated id=${id}`);

    return saved;

  } catch (error) {
    this.logger.error(`Failed to update task id=${id}`, error);
    throw error;
  }

}

async remove(id: number) {
  try {
    this.logger.log(`Deleting task id=${id}`);

    const task = await this.taskRepo.findOne({
      where: { id },
    });

    if (!task) {
      this.logger.warn(`Task not found id=${id}`);
      throw new NotFoundException('Task not found');
    }

    await this.taskRepo.remove(task);

    this.logger.log(`Task deleted id=${id}`);

    return { message: 'Task deleted successfully' };

  } catch (error) {
    this.logger.error(`Failed to delete task id=${id}`, error);
    throw error;
  }
}
}