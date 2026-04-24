import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(dto: CreateTaskDto) {
    try {
      this.logger.log('Creating task...');

      const task = this.taskRepo.create(dto);
      const savedTask = await this.taskRepo.save(task);

     await this.activityLogService.log(
       'create_task',
        'Task',
        savedTask.id,
        dto,
      );

      
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
    const { limit = 10, offset = 0, status ,search} = query;

    this.logger.log(
      `Fetching tasks |search=${search} limit=${limit} offset=${offset} status=${status}`,
    );

    const qb = this.taskRepo.createQueryBuilder('task');

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (search) {
     qb.andWhere('task.title ILIKE :search', {
        search: `%${search}%`,
     });
    }
    qb.take(limit);
    qb.skip(offset);

    const tasks = await qb.getMany();

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

   await this.activityLogService.log(
     'update_task',
     'Task',
      saved.id,
      dto,
      );
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

    await this.activityLogService.log(
      'delete_task',
      'Task',
      id,
     );

    this.logger.log(`Task deleted id=${id}`);

    return { message: 'Task deleted successfully' };

  } catch (error) {
    this.logger.error(`Failed to delete task id=${id}`, error);
    throw error;
  }
}


async updateStatus(id: number, dto: UpdateTaskStatusDto) {
  try {
    this.logger.log(`Updating status for task id=${id}`);

    const task = await this.taskRepo.findOne({
      where: { id },
    });

    if (!task) {
      this.logger.warn(`Task not found id=${id}`);
      throw new NotFoundException('Task not found');
    }

    task.status = dto.status;

    const saved = await this.taskRepo.save(task);
    await this.activityLogService.log(
       'update_status',
       'Task',
        saved.id,
        { status: dto.status },
      );

    this.logger.log(`Task status updated to ${dto.status}`);

    return saved;

  } catch (error) {
    this.logger.error(`Failed to update status for id=${id}`, error);
    throw error;
  }
}
}