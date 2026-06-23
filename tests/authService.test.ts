import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../src/models';
import * as authService from '../src/services/authService';
import { AppError } from '../src/utils/AppError';

jest.mock('../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    scope: jest.fn(),
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockedUser = User as jest.Mocked<typeof User>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedJwt.sign.mockReturnValue('mock-token' as never);
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      mockedUser.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);

      const mockUser = {
        id: 'user-id',
        name: 'John',
        email: 'john@example.com',
        role: 'member',
        toJSON: () => ({
          id: 'user-id',
          name: 'John',
          email: 'john@example.com',
          role: 'member',
        }),
      };
      mockedUser.create.mockResolvedValue(mockUser as never);

      const result = await authService.register({
        name: 'John',
        email: 'john@example.com',
        password: 'Password123!',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('john@example.com');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
    });

    it('should throw 409 if email already exists', async () => {
      mockedUser.findOne.mockResolvedValue({ id: 'existing' } as never);

      await expect(
        authService.register({
          name: 'John',
          email: 'existing@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow(new AppError('Email is already registered', 409));
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
        password: 'hashed',
        role: 'member',
        toJSON: () => ({
          id: 'user-id',
          email: 'john@example.com',
          password: 'hashed',
          role: 'member',
        }),
      };

      mockedUser.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      } as never);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await authService.login({
        email: 'john@example.com',
        password: 'Password123!',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw 401 for invalid email', async () => {
      mockedUser.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      } as never);

      await expect(
        authService.login({ email: 'wrong@example.com', password: 'pass' })
      ).rejects.toThrow(new AppError('Invalid email or password', 401));
    });

    it('should throw 401 for invalid password', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
        password: 'hashed',
        role: 'member',
      };

      mockedUser.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      } as never);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login({ email: 'john@example.com', password: 'wrong' })
      ).rejects.toThrow(new AppError('Invalid email or password', 401));
    });
  });
});
