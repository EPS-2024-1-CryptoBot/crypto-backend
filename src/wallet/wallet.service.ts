import { Injectable } from '@nestjs/common';
import { WalletApiService } from '@/wallet-api';
@Injectable()
export class WalletService {
  constructor(private readonly walletApiService: WalletApiService) {}
  create() {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallet`;
  }

  addTransaction(from: string, payload: any) {
    return this.walletApiService.addTransaction(from, payload);
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
