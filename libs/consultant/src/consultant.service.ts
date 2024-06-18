import { Injectable } from '@nestjs/common';
import { consultantApi } from './config';
import { PlaceOrderPayload } from 'src/consultant/dto/consultant.dto';

@Injectable()
export class ConsultantApiService {
  api_key = 'test_api_key';

  secret_key = 'test_secret_key';

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

  async symbolPrice(symbol: string) {
    try {
      const response = await consultantApi.get('/cryptobot/price/binance', {
        params: {
          api_key: this.api_key,
          secret_key: this.secret_key,
          symbol,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async placeOrder(orderPayload: PlaceOrderPayload) {
    try {
      const response = await consultantApi.post(
        '/cryptobot/place_order/binance',
        null,
        {
          params: {
            api_key: this.api_key,
            secret_key: this.secret_key,
            ...orderPayload,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderInfo(symbol: string, orderId: string) {
    try {
      const response = await consultantApi.get(
        '/cryptobot/order_status/binance',
        {
          params: {
            api_key: this.api_key,
            secret_key: this.secret_key,
            symbol,
            orderId,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(symbol: string, orderId: string) {
    try {
      const response = await consultantApi.delete(
        '/cryptobot/cancel_order/binance',
        {
          params: {
            api_key: this.api_key,
            secret_key: this.secret_key,
            symbol,
            orderId,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
