import { ConsultantApiService } from '@/consultant/consultant.service';
import { RsaApiService } from '@/rsa-api';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConsultantController } from 'src/consultant/consultant.controller';
import { ConsultantService } from 'src/consultant/consultant.service';
import { User } from 'src/database/entities';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

describe('ConsultantController', () => {
  let controller: ConsultantController;
  let consultantService: ConsultantService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultantController],
      providers: [
        ConsultantService,
        UserService,
        {
          provide: ConsultantApiService,
          useValue: {
            coinList: jest.fn(),
            getCoinListWithCurrentValue: jest.fn(),
            coinHistory: jest.fn(),
            addApiKeyBinanceToUser: jest.fn(),
            getApiKeyBinanceToUser: jest.fn(),
          },
        },
        {
          provide: RsaApiService,
          useValue: {
            getKeys: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ConsultantController>(ConsultantController);
    consultantService = module.get<ConsultantService>(ConsultantService);
    userService = module.get<UserService>(UserService);
  });

  describe('getCoinList', () => {
    it('should call consultantService.getCoinList', () => {
      const spy = jest.spyOn(consultantService, 'getCoinList');
      controller.getCoinList();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getCoinListWithSummary', () => {
    it('should call consultantService.getCoinListWithSummary', () => {
      const spy = jest.spyOn(consultantService, 'getCoinListWithSummary');
      controller.getCoinListWithSummary();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getCoinHistory', () => {
    it('should call consultantService.getCoinHistory with the correct coin', () => {
      const coin = 'BTC';
      const query = { coin };
      const spy = jest.spyOn(consultantService, 'getCoinHistory');
      controller.getCoinHistory(query);
      expect(spy).toHaveBeenCalledWith(coin);
    });
  });

  describe('addApiKeyBinanceToUser', () => {
    it('should call consultantService.addApiKeyBinanceToUser and userService.updateUserByFirebaseUid with the correct parameters', async () => {
      const firebaseUid = 'firebaseUid';
      const user = { api_token_binance: 'apiToken' };
      const response = 'response';
      const updatedUser = { updated: true };

      jest
        .spyOn(consultantService, 'addApiKeyBinanceToUser')
        .mockResolvedValue(response);
      jest
        .spyOn(userService, 'updateUserByFirebaseUid')
        .mockResolvedValue(updatedUser as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.addApiKeyBinanceToUser(firebaseUid, user as any, res);

      expect(consultantService.addApiKeyBinanceToUser).toHaveBeenCalledWith(
        firebaseUid,
      );
      expect(userService.updateUserByFirebaseUid).toHaveBeenCalledWith(
        firebaseUid,
        { api_token_binance: response },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 if an error occurs', async () => {
      const firebaseUid = 'firebaseUid';
      const user = { api_token_binance: 'apiToken' };
      const error = new Error('An error occurred');
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(consultantService, 'addApiKeyBinanceToUser')
        .mockRejectedValue(error);

      await controller.addApiKeyBinanceToUser(firebaseUid, user as any, res);

      expect(consultantService.addApiKeyBinanceToUser).toHaveBeenCalledWith(
        firebaseUid,
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message:
          error.message || 'An error occurred while searching for the user',
      });
    });
  });

  describe('decryptApiKeyBinance', () => {
    it('should call consultantService.getApiKeyBinanceToUser and return the response', async () => {
      const firebaseUid = 'firebaseUid';
      const user = { api_token_binance: 'apiToken' };
      const response = 'decryptedApiKey';
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(consultantService, 'getApiKeyBinanceToUser')
        .mockResolvedValue(response);

      await controller.decryptApiKeyBinance(firebaseUid, user, res);

      expect(consultantService.getApiKeyBinanceToUser).toHaveBeenCalledWith(
        user.api_token_binance,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should return 404 if an error occurs', async () => {
      const firebaseUid = 'firebaseUid';
      const user = { api_token_binance: 'apiToken' };
      const error = new Error('An error occurred');
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(consultantService, 'getApiKeyBinanceToUser')
        .mockRejectedValue(error);

      await controller.decryptApiKeyBinance(firebaseUid, user, res);

      expect(consultantService.getApiKeyBinanceToUser).toHaveBeenCalledWith(
        user.api_token_binance,
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message:
          error.message || 'An error occurred while searching for the user',
      });
    });
  });
});
