import { Injectable } from '@nestjs/common';
import { consultantApi } from './config';

@Injectable()
export class ConsultantApiService {
  async getCoinListWithCurrentValue() {
    try {
      const response = await consultantApi.get(
        '/crypto_currency/coins-summary',
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async coinList() {
    try {
      const response = await consultantApi.get('/crypto_currency/coins/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
