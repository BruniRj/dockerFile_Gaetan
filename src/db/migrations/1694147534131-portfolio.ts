import { MigrationInterface, QueryRunner } from "typeorm";

export class Portfolio1694147534131 implements MigrationInterface {
    name = 'Portfolio1694147534131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "portfolio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "date" character varying NOT NULL, "projectType" character varying NOT NULL, "projectLink" text array, "photos" text array, "profileId" uuid, CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id")); COMMENT ON COLUMN "portfolio"."id" IS 'Portfolio''s identifier'; COMMENT ON COLUMN "portfolio"."title" IS 'Portfolio''s title'; COMMENT ON COLUMN "portfolio"."description" IS 'Description''s title'; COMMENT ON COLUMN "portfolio"."date" IS 'Date of Portfolio'; COMMENT ON COLUMN "portfolio"."projectType" IS 'Project''s TYpe of the Portfolio'; COMMENT ON COLUMN "portfolio"."projectLink" IS 'Project''s Link of the Portfolio'; COMMENT ON COLUMN "portfolio"."photos" IS 'Photos of the Project'; COMMENT ON COLUMN "portfolio"."profileId" IS 'Id of the profile'`);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD CONSTRAINT "FK_f26b5c7b2087f9070a170dcc9ca" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portfolio" DROP CONSTRAINT "FK_f26b5c7b2087f9070a170dcc9ca"`);
        await queryRunner.query(`DROP TABLE "portfolio"`);
    }

}
