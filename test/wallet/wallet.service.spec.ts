import { Test, TestingModule } from '@nestjs/testing';
import { WalletApiService } from '@/wallet-api';
import { WalletService } from 'src/wallet/wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let walletApiService: WalletApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService, WalletApiService],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletApiService = module.get<WalletApiService>(WalletApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return "This action adds a new wallet"', () => {
      expect(service.create()).toBe('This action adds a new wallet');
    });
  });

  describe('findAll', () => {
    it('should return "This action returns all wallet"', () => {
      expect(service.findAll()).toBe('This action returns all wallet');
    });
  });

  describe('addTransaction', () => {
    it('should call walletApiService.addTransaction with the correct parameters', () => {
      const from = 'test-from';
      const payload = { test: 'payload' };
      const addTransactionSpy = jest
        .spyOn(walletApiService, 'addTransaction')
        .mockReturnValue({
          data: {
            id: 1,
            from: from,
            payload: payload,
          },
        } as any);

      service.addTransaction(from, payload);

      expect(addTransactionSpy).toHaveBeenCalledWith(from, payload);
    });
  });

  describe('findOne', () => {
    it('should return the correct wallet message', () => {
      const id = 1;
      const expectedMessage = `This action returns a #${id} wallet`;

      expect(service.findOne(id)).toBe(expectedMessage);
    });
  });

  describe('update', () => {
    it('should return the correct wallet message', () => {
      const id = 1;
      const expectedMessage = `This action updates a #${id} wallet`;

      expect(service.update(id)).toBe(expectedMessage);
    });
  });

  describe('remove', () => {
    it('should return the correct wallet message', () => {
      const id = 1;
      const expectedMessage = `This action removes a #${id} wallet`;

      expect(service.remove(id)).toBe(expectedMessage);
    });
  });
});
