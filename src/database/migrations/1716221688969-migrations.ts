import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeysToUser1714235108015 implements MigrationInterface {
  name = 'AddKeysToUser1714235108015';

  user_table = 'user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.user_table}"
      ADD "public_key" character varying NOT NULL,
      ADD "private_key" character varying[] NOT NULL,
      ADD CONSTRAINT "pk_${this.user_table}" PRIMARY KEY ("id"),
      ADD CONSTRAINT "uq_${this.user_table}_unique" UNIQUE ("email");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.user_table}"
      DROP CONSTRAINT "uq_${this.user_table}_unique",
      DROP CONSTRAINT "pk_${this.user_table}",
      DROP COLUMN "private_key",
      DROP COLUMN "public_key";
    `);
  }
}
