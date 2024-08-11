import { MigrationInterface, QueryRunner } from "typeorm";

export class User1692618345269 implements MigrationInterface {
    name = 'User1692618345269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "refreshTokenHashed" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")); COMMENT ON COLUMN "users"."user_id" IS 'Id of the user'; COMMENT ON COLUMN "users"."email" IS 'Email of the user'; COMMENT ON COLUMN "users"."password" IS 'Password of the user'; COMMENT ON COLUMN "users"."created_at" IS 'creation date of the user'; COMMENT ON COLUMN "users"."updated_at" IS 'Updated date of the User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
