import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueTitle1776984548623 implements MigrationInterface {
    name = 'AddUniqueTitle1776984548623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "UQ_3399e2710196ea4bf734751558f" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "UQ_3399e2710196ea4bf734751558f"`);
    }

}
