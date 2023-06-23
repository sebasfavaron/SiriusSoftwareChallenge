import request from 'supertest';
import { app } from '..';
import * as mailHandler from '../mailHandler';
import * as userDB from '../userDB';
import { userGuard } from '../userHandler';
import { mockStats } from './mockStats';

const mockDatabase = () => {
  jest.spyOn(userDB, 'setUpDatabase').mockImplementation(async () => {});
  jest.spyOn(userDB, 'createUser').mockImplementation(async () => ({} as any));
  jest.spyOn(userDB, 'getUserById').mockImplementation(async () => ({} as any));
  jest
    .spyOn(userDB, 'getUserByUsername')
    .mockImplementation(async () => ({} as any));
  jest.spyOn(userDB, 'updateUser').mockImplementation(async () => ({} as any));
  jest
    .spyOn(userDB.userSchema.methods, 'incrementDailyMailsSent')
    .mockImplementation(async () => {});
};

const skipAuthorization = () => {
  jest
    .spyOn(userGuard.isAuthorized, 'hasBearer')
    .mockImplementation(() => true);
  jest
    .spyOn(userGuard.isAuthorized, 'skipTokenVerification')
    .mockImplementation(() => true);
};

const skipAuthentication = () => {
  jest.spyOn(userGuard, 'isAuthenticated').mockImplementation(() => true);
};

const mockMailServices = () => {
  jest
    .spyOn(mailHandler, 'sendMailSendgrid')
    .mockReturnValue({ statusCode: 202 } as any);
  jest.spyOn(mailHandler, 'sendMailMailgun').mockReturnValue({} as any);
};

describe('mailHandler', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockDatabase();
    mockMailServices();
  });

  describe('GET /stats', () => {
    it('should throw unauthorized error if a bearer token is not provided', async () => {
      // When
      const res = await request(app).get('/stats');

      // Then
      expect(res.status).toEqual(401);
    });

    it('should throw forbidden error if not an admin', async () => {
      // Given
      skipAuthorization();

      // When
      const res = await request(app).get('/stats');

      // Then
      expect(res.status).toEqual(403);
    });

    it('if admin, should return list of users and daily sent mails', async () => {
      // Given
      skipAuthorization();
      skipAuthentication();
      jest
        .spyOn(userDB, 'getUsersDailyMailsSent')
        .mockReturnValue(mockStats as any);

      // When
      const res = await request(app).get('/stats');

      // Then
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ result: mockStats });
    });
  });

  describe('POST /send-mail', () => {
    it('should send mail if user is authorized and under the daily quota', async () => {
      // Given
      skipAuthorization();
      jest.spyOn(userDB, 'getUserByUsername').mockImplementation(
        async () =>
          ({
            dailyMailsSent: 0,
            incrementDailyMailsSent: () => {},
          } as any)
      );

      // When
      const res = await request(app).post('/send-mail');

      // Then
      expect(res.status).toEqual(200);
    });

    it('should throw error if user is authorized but over the daily quota', async () => {
      // Given
      skipAuthorization();
      jest
        .spyOn(userDB, 'getUserByUsername')
        .mockImplementation(async () => ({ dailyMailsSent: 9999999 } as any));

      // When
      const res = await request(app).post('/send-mail');

      // Then
      expect(res.status).toEqual(401);
    });

    it('should throw unauthorized error if user does not provide valid JWT token', async () => {
      // Given
      jest.spyOn(userGuard.isAuthorized, 'hasBearer').mockReturnValue(false);

      // When
      const res = await request(app).post('/send-mail');

      // Then
      expect(res.status).toEqual(401);
    });
  });
});
