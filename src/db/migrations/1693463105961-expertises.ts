import { MigrationInterface, QueryRunner } from "typeorm";

export class Expertises1693463105961 implements MigrationInterface {
    name = 'Expertises1693463105961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expertise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "domain" text array NOT NULL, "description" character varying NOT NULL, "profileId" uuid, CONSTRAINT "PK_0c1f773f9419573f6bc37eebb7f" PRIMARY KEY ("id")); COMMENT ON COLUMN "expertise"."id" IS 'Id of the expertise'; COMMENT ON COLUMN "expertise"."domain" IS 'Domain of the expertise'; COMMENT ON COLUMN "expertise"."description" IS 'Description of the expertise'; COMMENT ON COLUMN "expertise"."profileId" IS 'Id of the profile'`);
        await queryRunner.query(`ALTER TABLE "expertise" ADD CONSTRAINT "FK_99921caf16d815f52ebdf6c611d" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expertise" DROP CONSTRAINT "FK_99921caf16d815f52ebdf6c611d"`);
        await queryRunner.query(`DROP TABLE "expertise"`);
    }

}
