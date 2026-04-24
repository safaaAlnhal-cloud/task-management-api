import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private logRepo: Repository<ActivityLog>,
  ) {}

  async log(
    action: string,
    entity: string,
    entityId?: number,
    metadata?: any,
  ) {
    try {
      const log = this.logRepo.create({
        action,
        entity,
        entityId,
        metadata,
      });

      return await this.logRepo.save(log);
    } catch (error) {
      this.logger.error('Failed to save activity log', error);

      return null;
    }
  }
}