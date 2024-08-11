import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileService1694146257537 implements MigrationInterface {
    name = 'ProfileService1694146257537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "iconUrl" character varying, "profileId" uuid, CONSTRAINT "PK_b46c70b6f43e1694b8b19f56207" PRIMARY KEY ("id")); COMMENT ON COLUMN "profile_service"."id" IS 'Profile''s Service Id'; COMMENT ON COLUMN "profile_service"."title" IS 'Title of the Profile Service'; COMMENT ON COLUMN "profile_service"."description" IS 'Profiel''s Service Description'; COMMENT ON COLUMN "profile_service"."iconUrl" IS 'Profile''s Service Icon Url'; COMMENT ON COLUMN "profile_service"."profileId" IS 'Id of the profile'`);
        await queryRunner.query(`ALTER TABLE "profile_service" ADD CONSTRAINT "FK_d2e373ab6e930b180d8e2de3468" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_service" DROP CONSTRAINT "FK_d2e373ab6e930b180d8e2de3468"`);
        await queryRunner.query(`DROP TABLE "profile_service"`);
    }

}
