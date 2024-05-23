import { Injectable } from '@nestjs/common';
import { rsaApi } from './config';

@Injectable()
export class RsaApiService {
  async getKeys() {
    try {
      const result = await rsaApi.get('/rsa/keygen', {
        params: {
          encrypt: true,
        },
      });
      return result;
    } catch (error) {
      console.error('Error: ', JSON.stringify(error.response.data));
    }
  }

  async encrypt(api_key_binance: string, public_key: string) {
    try {
      const result = await rsaApi.post('/rsa/encrypt', {
        message: api_key_binance,
        public_key,
      });
      return result;
    } catch (error) {
      console.error('Error: ', JSON.stringify(error.response.data));
      throw error;
    }
  }

  async decrypt(api_key_binance: string, private_key: string) {
    try {
      const result = await rsaApi.post('/rsa/decrypt', {
        message: api_key_binance,
        private_key,
      });
      return result;
    } catch (error) {
      console.error('Error: ', JSON.stringify(error.response.data));
      throw error;
    }
  }
}
