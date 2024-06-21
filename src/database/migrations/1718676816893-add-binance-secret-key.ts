import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBinanceSecretKey1718676816893 implements MigrationInterface {
  name = 'AddBinanceSecretKey1718676816893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "binance_api_secret" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "binance_api_secret"`,
    );
  }
}
