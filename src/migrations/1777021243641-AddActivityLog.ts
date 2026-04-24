import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivityLog1777021243641 implements MigrationInterface {
    name = 'AddActivityLog1777021243641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity_log" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "entity" character varying NOT NULL, "entityId" integer, "metadata" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "activity_log"`);
    }

}
