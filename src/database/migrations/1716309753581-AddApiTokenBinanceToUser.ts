import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApiTokenBinanceToUser1714236108015 implements MigrationInterface {
  name = 'AddApiTokenBinanceToUser1714236108015';

  user_table = 'user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.user_table}"
      ADD "api_token_binance" character varying;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.user_table}"
      DROP COLUMN "api_token_binance";
    `);
  }
}
