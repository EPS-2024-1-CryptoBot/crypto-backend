import { Module } from '@nestjs/common';
import { ConsultantController } from './consultant.controller';
import { ConsultantService } from './consultant.service';
import { ConsultantApiService } from '@/consultant';

@Module({
  controllers: [ConsultantController],
  providers: [ConsultantService, ConsultantApiService],
})
export class ConsultantModule {}
