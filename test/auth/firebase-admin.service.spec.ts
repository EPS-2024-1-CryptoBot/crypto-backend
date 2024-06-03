import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAdminService } from '../../src/auth/firebase-admin.service';

describe('FirebaseAdminService', () => {
  let service: FirebaseAdminService;

  beforeAll(async () => {
    jest.mock('firebase-admin', () => ({
      initializeApp: jest.fn().mockImplementation(() => ({
        auth: jest.fn(),
      })),
      app: jest.fn(),
      credential: {
        cert: jest.fn().mockReturnValue({} as any),
      },
      auth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn(),
        updateUser: jest.fn(),
      }),
      apps: [
        {
          name: 'CryptoBotWebApp',
        },
      ],
    }));
    jest.mock('src/app.config', () => ({
      appConfig: {
        google: {
          firebase_service_account: {},
        },
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FirebaseAdminService,
          useValue: {
            isInitialized: jest.fn().mockReturnValue(true),
            verifyToken: jest.fn(),
            resetPassword: jest.fn().mockResolvedValue({}),
            adminInstance: {
              auth: jest.fn().mockReturnValue({
                updateUser: jest.fn(),
                verifyIdToken: jest.fn(),
              }),
            },
          },
          useClass: FirebaseAdminService,
        },
      ],
    }).compile();

    service = module.get<FirebaseAdminService>(FirebaseAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isInitialized', () => {
    it('should return true if the admin instance is initialized', () => {
      expect(service.isInitialized()).toBe(true);
    });
  });

  describe('verifyToken', () => {
    it('should throw an error if the token is not verified', async () => {
      const token = 'invalid-token';
      const errorMessage = 'An error occurred while verifying the token';

      jest
        .spyOn(service.adminInstance.auth(), 'verifyIdToken')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.verifyToken(token)).rejects.toThrow(errorMessage);
    });
  });
});
