import { MigrationInterface, QueryRunner } from "typeorm";

export class Reward1693290168926 implements MigrationInterface {
    name = 'Reward1693290168926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reward" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rewardTitle" character varying NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "profileId" uuid, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id")); COMMENT ON COLUMN "reward"."id" IS 'Id of the reward'; COMMENT ON COLUMN "reward"."rewardTitle" IS 'Title of the reward'; COMMENT ON COLUMN "reward"."description" IS 'Title of the reward'; COMMENT ON COLUMN "reward"."date" IS 'Date of obtaining the reward'; COMMENT ON COLUMN "reward"."profileId" IS 'Id of the profile'`);
        await queryRunner.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_e0f4213c48e21f5d6617dd9c9e9" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_e0f4213c48e21f5d6617dd9c9e9"`);
        await queryRunner.query(`DROP TABLE "reward"`);
    }

}
