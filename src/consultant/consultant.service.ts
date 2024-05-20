import { ConsultantApiService } from '@/consultant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultantService {
  constructor(private readonly consultantApiService: ConsultantApiService) {}

  async getCoinList() {
    return await this.consultantApiService.coinList();
  }

  async getCoinListWithSummary() {
    return await this.consultantApiService.getCoinListWithCurrentValue();
  }
}
