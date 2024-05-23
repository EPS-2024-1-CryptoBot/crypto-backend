import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import { Injectable } from '@nestjs/common';

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

  async addApiKeyBinanceToUser(firebaseUid: string) {
    try {
      // const response = await this.consultantApiService.getApiKeyBinanceToUser(
      //   firebaseUid,
      // );
      const api_key_binance = 'asdASANLjslnaDLnas8su89oh312yedquasd';
      const public_key = process.env.SYSTEM_PUB_K;
      const response_rsa = await this.RsaApiService.encrypt(
        api_key_binance,
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
}
