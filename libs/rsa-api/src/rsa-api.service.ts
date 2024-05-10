import { rsaApi } from '@/wallet-api/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RsaApiService {
    async getKeys() {
        try {
            const result = await rsaApi.get('/rsa/keygen', {
                params: {
                    encrypt: true
                }
            });
            return result;
        } catch (error) {
            console.error("Error: ", JSON.stringify(error.response.data));
        }
    }
}