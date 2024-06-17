import { Injectable } from '@nestjs/common';
import { consultantApi } from './config';

@Injectable()
export class ConsultantApiService {
  api_key = 'seu_api_key_aqui';

  secret_key = 'sua_secret_key_aqui';

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

  async coinHistory(coin: string) {
    try {
      const response = await consultantApi.get(
        `/crypto_currency/coins/${coin}/chart`,
      );
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }

  async binanceBalance() {
    try {
      const response = await consultantApi.get(
        '/cryptobot/get_balance/binance',
        {
          params: {
            api_key: this.api_key,
            secret_key: this.secret_key,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async contractList() {
    try {
      const response = await consultantApi.get('/cryptobot/contracts/binance', {
        params: {
          api_key: this.api_key,
          secret_key: this.secret_key,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
