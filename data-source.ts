import { DataSource } from 'typeorm';
import { Task } from './src/tasks/task.entity';
import * as dotenv from 'dotenv';
import { ActivityLog } from './src/activity-log/activity-log.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [Task, ActivityLog],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});