import { Module } from '@nestjs/common';
import { ConsultantApiService } from './consultant.service';

@Module({
  providers: [ConsultantApiService],
  exports: [ConsultantApiService],
})
export class ConsultantApiModule {}
