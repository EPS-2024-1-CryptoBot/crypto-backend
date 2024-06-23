import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import { Injectable } from '@nestjs/common';
import { PlaceOrderPayload } from './dto/consultant.dto';
import { stockCompassApi } from './consultant.utils';

@Injectable()
export class ConsultantService {
  constructor(
    private readonly consultantApiService: ConsultantApiService,
    private readonly rsaApiService: RsaApiService,
  ) {}

  async getCoinList() {
    return await this.consultantApiService.coinList();
  }

  async getCoinListWithSummary() {
    return await this.consultantApiService.getCoinListWithCurrentValue();
  }

  async getCoinHistory(coin: string) {
    return await this.consultantApiService.coinHistory(coin);
  }

  async addApiKeyBinanceToUser(apiKey: string) {
    try {
      const public_key = process.env.SYSTEM_PUB_K;
      // console.log('public_key', public_key);
      // console.log('apiKey', apiKey);
      const response_rsa = await this.rsaApiService.encrypt(apiKey, public_key);
      return response_rsa.data.encrypted_message;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', error);
      throw error;
    }
  }

  async getApiKeyBinanceToUser(api_key_binance: string) {
    try {
      console.log('api_key_binance');
      const private_key = process.env.SYSTEM_PVT_K;
      const response = await this.rsaApiService.decrypt(
        api_key_binance,
        private_key,
      );
      return response.data.decrypted_message;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', error);
      throw new Error(error);
    }
  }

  async getContractList(user: any) {
    const api_token_binance = await this.getApiKeyBinanceToUser(
      user.api_token_binance,
    );
    const binance_api_secret = await this.getApiKeyBinanceToUser(
      user.binance_api_secret,
    );

    return await this.consultantApiService.contractList(
      api_token_binance,
      binance_api_secret,
    );
  }

  async getBinanceBalance() {
    return await this.consultantApiService.binanceBalance();
  }

  async getBinanceSymbolInfo(symbol: string) {
    return await this.consultantApiService.symbolPrice(symbol);
  }

  async placeOrder(payload: PlaceOrderPayload) {
    return await this.consultantApiService.placeOrder(payload);
  }

  async getOrderInfo(orderId: string, symbol: string) {
    return await this.consultantApiService.getOrderInfo(orderId, symbol);
  }

  async cancelOrder(orderId: string, symbol: string) {
    return await this.consultantApiService.cancelOrder(orderId, symbol);
  }

  async getStockSummary(ticker: string) {
    try {
      const result = await stockCompassApi.get(
        `/api/stocks/stock-summary/${ticker}`,
      );
      return result.data;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', error);
      return { error: 'Error to get stock summary' };
    }
  }
}
