import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import { Injectable } from '@nestjs/common';
import { PlaceOrderPayload } from './dto/consultant.dto';

@Injectable()
export class ConsultantService {
  constructor(
    private readonly consultantApiService: ConsultantApiService,
    private readonly RsaApiService: RsaApiService,
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
      console.log("public_key", public_key);
      console.log("apiKey", apiKey);
      const response_rsa = await this.RsaApiService.encrypt(
        apiKey,
        public_key,
      );
      return response_rsa.data.encrypted_message;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', error);
      throw new Error(error);
    }
  }

  async getApiKeyBinanceToUser(api_key_binance: string) {
    try {
      console.log("api_key_binance");
      const private_key = process.env.SYSTEM_PVT_K;
      const response = await this.RsaApiService.decrypt(
        api_key_binance,
        private_key,
      );
      return response.data.decrypted_message;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', error);
      throw new Error(error);
    }
  }

  async getContractList(api_token_binance: string, binance_api_secret: string) {
    console.log("api_token_binance", api_token_binance);
    console.log("binance_api_secret", binance_api_secret);
    return await this.consultantApiService.contractList(api_token_binance, binance_api_secret);
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
}
