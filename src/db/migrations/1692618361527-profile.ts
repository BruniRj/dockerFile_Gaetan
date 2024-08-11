import { MigrationInterface, QueryRunner } from "typeorm";

export class Profile1692618361527 implements MigrationInterface {
    name = 'Profile1692618361527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."profiles_type_enum" AS ENUM('talent', 'particular', 'entreprise')`);
        await queryRunner.query(`CREATE TABLE "profiles" ("profile_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying NOT NULL, "lastname" character varying, "phoneNumber" character varying, "type" "public"."profiles_type_enum" NOT NULL, "userUserId" uuid, CONSTRAINT "REL_d24176a32d5c656e26fb7299ff" UNIQUE ("userUserId"), CONSTRAINT "PK_6a23df60690da92fd263eca2e93" PRIMARY KEY ("profile_id")); COMMENT ON COLUMN "profiles"."profile_id" IS 'Id of the profile'; COMMENT ON COLUMN "profiles"."firstname" IS 'First name of the profile'; COMMENT ON COLUMN "profiles"."lastname" IS 'Lastname of the profile'; COMMENT ON COLUMN "profiles"."phoneNumber" IS 'Phone number of the profile'; COMMENT ON COLUMN "profiles"."type" IS 'type of the profile'; COMMENT ON COLUMN "profiles"."userUserId" IS 'Id of the user'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_d24176a32d5c656e26fb7299ff3" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_d24176a32d5c656e26fb7299ff3"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_type_enum"`);
    }

}
