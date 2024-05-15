import { Injectable } from '@nestjs/common';
import { walletApi } from './config';

@Injectable()
export class WalletApiService {
  async test() {
    try {
      console.log('teste');
      const result = await walletApi.get('/');
      console.log(result.data);
    } catch (error) {
      console.error('ALERTA DE ERRO: ', error);
    }
  }

  async addTransaction(from: string, payload: any) {
    try {
      const result = await walletApi.post('/add_transaction', payload, {
        params: {
          user: from,
        },
      });

      return result.data;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', JSON.stringify(error.response.data));
    }
  }

  async mineBlock(from: string) {
    try {
      console.log(from);
      const result = await walletApi.get('/mine_block', {
        params: {
          user: from,
        },
      });

      return result.data;
    } catch (error) {
      console.error('ALERTA DE ERRO: ', JSON.stringify(error.response.data));
    }
  }
}
