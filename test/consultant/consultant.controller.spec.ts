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

  beforeAll(async () => {
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
});
