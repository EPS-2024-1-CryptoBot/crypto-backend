import { Test, TestingModule } from '@nestjs/testing';

import { WalletApiService } from '@/wallet-api';
import { RequestWithUser } from 'src/commomTypes';
import { CreateWalletDto } from 'src/wallet/dto/create-wallet.dto';
import { UpdateWalletDto } from 'src/wallet/dto/update-wallet.dto';
import { WalletController } from 'src/wallet/wallet.controller';
import { WalletService } from 'src/wallet/wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let walletService: WalletService;
  let walletApiService: WalletApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [WalletService, WalletApiService],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
    walletApiService = module.get<WalletApiService>(WalletApiService);
  });

  describe('create', () => {
    it('should call walletService.create with the correct parameters', () => {
      const createWalletDto: CreateWalletDto = {
        receiver: 'example',
        amount: 100,
      };

      jest
        .spyOn(walletService, 'create')
        .mockReturnValueOnce('This action adds a new wallet');

      const result = controller.create(createWalletDto);

      expect(walletService.create).toHaveBeenCalledWith();
      expect(result).toEqual('This action adds a new wallet');
    });
  });

  describe('addTransaction', () => {
    it('should call walletApiService.addTransaction with the correct parameters', () => {
      const from = 'example';
      const createWalletDto: CreateWalletDto = {
        receiver: 'example',
        amount: 100,
      };

      jest
        .spyOn(walletApiService, 'addTransaction')
        .mockReturnValueOnce({} as any);

      const result = controller.addTransaction(from, createWalletDto);

      expect(walletApiService.addTransaction).toHaveBeenCalledWith(
        from,
        createWalletDto,
      );
      expect(result).toEqual({
        /* expected result */
      });
    });
  });

  describe('update', () => {
    it('should call walletService.update with the correct parameters', () => {
      const id = 'example';
      const updateWalletDto: UpdateWalletDto = {
        /* updateWalletDto data */
      };

      jest
        .spyOn(walletService, 'update')
        .mockReturnValueOnce(`This action updates a #${id} wallet`);

      const result = controller.update(id, updateWalletDto);

      expect(result).toEqual(`This action updates a #${id} wallet`);
    });
  });

  describe('remove', () => {
    it('should call walletService.remove with the correct parameters', () => {
      const id = 'example';

      jest
        .spyOn(walletService, 'remove')
        .mockReturnValueOnce(`This action removes a #${id} wallet`);

      const result = controller.remove(id);

      expect(walletService.remove).toHaveBeenCalledWith(+id);
      expect(result).toEqual(`This action removes a #${id} wallet`);
    });
  });

  describe('mineBlock', () => {
    it('should call walletApiService.mineBlock with the correct parameters', () => {
      const req: RequestWithUser = {
        user: {
          firebaseUid: 'example',
        },
      } as any;

      jest.spyOn(walletApiService, 'mineBlock').mockReturnValueOnce({} as any);

      const result = controller.mineBlock(req);

      expect(walletApiService.mineBlock).toHaveBeenCalledWith(
        req.user.firebaseUid,
      );
      expect(result).toEqual({
        /* expected result */
      });
    });
  });

  describe('getBalance', () => {
    it('should call walletApiService.getBalance with the correct parameters', () => {
      const req: RequestWithUser = {
        user: {
          firebaseUid: 'example',
        },
      } as any;

      jest.spyOn(walletApiService, 'getBalance').mockReturnValueOnce({
        balance: 100,
      } as any);

      const result = controller.getBalance(req);

      expect(walletApiService.getBalance).toHaveBeenCalledWith(
        req.user.firebaseUid,
      );
      expect(result).toEqual({
        balance: 100,
      });
    });
  });

  describe('getTransactions', () => {
    it('should call walletApiService.getTransactions with the correct parameters', () => {
      const req: RequestWithUser = {
        user: {
          firebaseUid: 'example',
        },
      } as any;

      jest
        .spyOn(walletApiService, 'getTransactions')
        .mockReturnValueOnce({} as any);

      const result = controller.getTransactions(req);

      expect(walletApiService.getTransactions).toHaveBeenCalledWith(
        req.user.firebaseUid,
      );
      expect(result).toEqual({
        /* expected result */
      });
    });
  });
});
