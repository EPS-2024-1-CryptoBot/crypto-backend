import { Injectable } from '@nestjs/common';
import { walletApi } from './config';

@Injectable()
export class WalletApiService {
    async test() {
        try {
            console.log("teste");
            const result = await walletApi.get('/');
            console.log(result.data);

        } catch (error) {
            console.error("ALERTA DE ERRO: ", error);
        }

    }

    async addTransaction(from: string, payload: any) {
        try {
            console.log("AddTransaction4444 =====> ", from, payload);
            const result = await walletApi.post('/add_transaction', payload, {
                params: {
                    user: from
                }
            });

            // Imprime os dados retornados pela API
            console.log(result.data);
        } catch (error) {
            console.error("ALERTA DE ERRO: ", JSON.stringify(error.response.data));
        }
    }
}
