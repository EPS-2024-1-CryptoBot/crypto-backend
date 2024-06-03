import { Test, TestingModule } from '@nestjs/testing';

import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import { ConsultantService } from 'src/consultant/consultant.service';

describe('ConsultantService', () => {
  let consultantService: ConsultantService;
  let consultantApiService: ConsultantApiService;
  let rsaApiService: RsaApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultantService,
        {
          provide: ConsultantApiService,
          useValue: {
            coinList: jest.fn(),
            getCoinListWithCurrentValue: jest.fn(),
            coinHistory: jest.fn(),
          },
        },
        {
          provide: RsaApiService,
          useValue: {
            encrypt: jest.fn().mockResolvedValue({
              data: {
                encrypted_message: 'encrypted message',
              },
            }),
            decrypt: jest.fn().mockResolvedValue({
              data: {
                decrypted_message: 'encrypted message',
              },
            }),
          },
        },
      ],
    }).compile();

    consultantService = module.get<ConsultantService>(ConsultantService);
    consultantApiService =
      module.get<ConsultantApiService>(ConsultantApiService);
    rsaApiService = module.get<RsaApiService>(RsaApiService);
  });

  describe('getCoinList', () => {
    it('should call consultantApiService.coinList', async () => {
      // Act
      await consultantService.getCoinList();

      // Assert
      expect(consultantApiService.coinList).toHaveBeenCalled();
    });
  });

  describe('getCoinListWithSummary', () => {
    it('should call consultantApiService.getCoinListWithCurrentValue', async () => {
      // Act
      await consultantService.getCoinListWithSummary();

      // Assert
      expect(
        consultantApiService.getCoinListWithCurrentValue,
      ).toHaveBeenCalled();
    });
  });

  describe('getCoinHistory', () => {
    it('should call consultantApiService.coinHistory with the provided coin', async () => {
      // Arrange
      const coin = 'BTC';

      // Act
      await consultantService.getCoinHistory(coin);

      // Assert
      expect(consultantApiService.coinHistory).toHaveBeenCalledWith(coin);
    });
  });

  describe('addApiKeyBinanceToUser', () => {
    it('should call RsaApiService.encrypt with the provided api key and public key', async () => {
      // Arrange
      const firebaseUid = '12345';
      const api_key_binance = 'asdASANLjslnaDLnas8su89oh312yedquasd';
      const public_key = process.env.SYSTEM_PUB_K;

      // Act
      await consultantService.addApiKeyBinanceToUser(firebaseUid);

      // Assert
      expect(rsaApiService.encrypt).toHaveBeenCalledWith(
        api_key_binance,
        public_key,
      );
    });
  });

  describe('getApiKeyBinanceToUser', () => {
    it('should call RsaApiService.decrypt with the provided api key and private key', async () => {
      // Arrange
      const api_key_binance = 'asdASANLjslnaDLnas8su89oh312yedquasd';
      const private_key = process.env.SYSTEM_PVT_K;

      // Act
      await consultantService.getApiKeyBinanceToUser(api_key_binance);

      // Assert
      expect(rsaApiService.decrypt).toHaveBeenCalledWith(
        api_key_binance,
        private_key,
      );
    });
  });
});
