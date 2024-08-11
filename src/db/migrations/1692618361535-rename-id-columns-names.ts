import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameIdColumnsNames1692618361535 implements MigrationInterface {
    name = 'RenameIdColumnsNames1692618361535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "user_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "profiles" RENAME COLUMN "profile_id" TO "id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" RENAME COLUMN "id" TO "profile_id"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id" TO "user_id"`);
    }

}
