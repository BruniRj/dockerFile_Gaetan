import { MigrationInterface, QueryRunner } from "typeorm";

export class Educations1693290108336 implements MigrationInterface {
    name = 'Educations1693290108336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "educationTitle" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "profileId" uuid, CONSTRAINT "PK_b5ec6bb0359d6573fe9b28f7129" PRIMARY KEY ("id")); COMMENT ON COLUMN "Education"."id" IS 'Id of education'; COMMENT ON COLUMN "Education"."educationTitle" IS 'title of the education'; COMMENT ON COLUMN "Education"."startDate" IS 'starting date of the education'; COMMENT ON COLUMN "Education"."endDate" IS 'ending date of the education'; COMMENT ON COLUMN "Education"."description" IS 'description of the education'; COMMENT ON COLUMN "Education"."profileId" IS 'Id of the profile'`);
        await queryRunner.query(`ALTER TABLE "Education" ADD CONSTRAINT "FK_aeb943e05463fe26a0c84c25331" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Education" DROP CONSTRAINT "FK_aeb943e05463fe26a0c84c25331"`);
        await queryRunner.query(`DROP TABLE "Education"`);
    }

}
