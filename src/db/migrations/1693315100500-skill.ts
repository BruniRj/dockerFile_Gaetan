import { MigrationInterface, QueryRunner } from "typeorm";

export class Skill1693315100500 implements MigrationInterface {
    name = 'Skill1693315100500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "softSkillName" character varying NOT NULL, "profileId" uuid, CONSTRAINT "PK_2f371d611f4a29288e11c9b628e" PRIMARY KEY ("id")); COMMENT ON COLUMN "Skills"."id" IS 'id of the skills'; COMMENT ON COLUMN "Skills"."softSkillName" IS 'name of the soft skills'; COMMENT ON COLUMN "Skills"."profileId" IS 'Id of the profile'`);
        await queryRunner.query(`ALTER TABLE "Skills" ADD CONSTRAINT "FK_ec6fcd87b6ea4742b64e95ac4ef" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Skills" DROP CONSTRAINT "FK_ec6fcd87b6ea4742b64e95ac4ef"`);
        await queryRunner.query(`DROP TABLE "Skills"`);
    }

}
