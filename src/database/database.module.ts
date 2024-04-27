import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MODULE_OPTIONS } from './db.config';
import { EntityModule } from './entity.module';

@Module({
  imports: [TypeOrmModule.forRoot(MODULE_OPTIONS), EntityModule],
})
export class DatabaseModule {}
