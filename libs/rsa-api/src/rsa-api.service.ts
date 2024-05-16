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
}
