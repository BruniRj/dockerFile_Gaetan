import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncSchema1693913739283 implements MigrationInterface {
    name = 'SyncSchema1693913739283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_d24176a32d5c656e26fb7299ff3"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "REL_d24176a32d5c656e26fb7299ff"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "biography" text`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."biography" IS 'Biography of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "platformsUrl" json`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."platformsUrl" IS 'platforms Url of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "skills" json NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."skills" IS 'skills of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "avatar" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."avatar" IS 'image of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "UQ_315ecd98bd1a42dcf2ec4e2e985" UNIQUE ("userId")`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."userId" IS 'Id of the user'`);
        await queryRunner.query(`ALTER TABLE "expertise" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "expertise" ADD "description" text NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "expertise"."description" IS 'Description of the expertise'`);
        await queryRunner.query(`ALTER TABLE "Education" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "Education" ADD "description" text`);
        await queryRunner.query(`COMMENT ON COLUMN "Education"."description" IS 'description of the education'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`COMMENT ON COLUMN "Education"."description" IS 'description of the education'`);
        await queryRunner.query(`ALTER TABLE "Education" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "Education" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "expertise"."description" IS 'Description of the expertise'`);
        await queryRunner.query(`ALTER TABLE "expertise" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "expertise" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."userId" IS 'Id of the user'`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "UQ_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "userId"`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."avatar" IS 'image of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "avatar"`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."skills" IS 'skills of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "skills"`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."platformsUrl" IS 'platforms Url of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "platformsUrl"`);
        await queryRunner.query(`COMMENT ON COLUMN "profiles"."biography" IS 'Biography of the profile'`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "biography"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "userUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "REL_d24176a32d5c656e26fb7299ff" UNIQUE ("userUserId")`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_d24176a32d5c656e26fb7299ff3" FOREIGN KEY ("userUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
