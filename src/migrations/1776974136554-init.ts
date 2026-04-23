import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776974136554 implements MigrationInterface {
    name = 'Init1776974136554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('todo', 'in_progress', 'done')`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "status" "public"."task_status_enum" NOT NULL DEFAULT 'todo', "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'medium', "dueDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    }

}
