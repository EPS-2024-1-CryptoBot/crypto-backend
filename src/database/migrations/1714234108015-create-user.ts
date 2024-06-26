import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1714234108015 implements MigrationInterface {
  name = 'CreateUser1714234108015';

  user_table = 'user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE "${this.user_table}" (
        "id"                uuid                        NOT NULL DEFAULT uuid_generate_v4(),
        "created_at"        TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
        "email"             citext                      NOT NULL,
        "first_name"        character varying           NOT NULL,
        "last_name"         character varying           NOT NULL,
        "firebase_uid"      character varying,
        "public_key"        character varying           NOT NULL,
        "private_key"       character varying[]         NOT NULL,

        CONSTRAINT "pk_${this.user_table}"          PRIMARY KEY ("id"),
        CONSTRAINT "uq_${this.user_table}_unique"   UNIQUE      ("email")
    );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "${this.user_table}"`);
  }
}
