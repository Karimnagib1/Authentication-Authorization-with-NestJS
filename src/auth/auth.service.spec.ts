import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '..//user//services/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const repositoryMock = {};
  const mockUserService = {
    getUserByEmail: jest.fn((email) => {
      return {
        id: 1,
        name: 'string',
        email: 'string',
        password: 'string',
        state: 'string',
        city: 'string',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UserService, useValue: mockUserService },
        { provide: getRepositoryToken(User), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should validate user', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    const user = await service.validateUser('string', 'string');
    expect(user).toEqual({
      id: 1,
      name: 'string',
      email: 'string',
      password: 'string',
      state: 'string',
      city: 'string',
    });
  });
  it('should return null if user not found', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    mockUserService.getUserByEmail.mockReturnValueOnce(null);
    const user = await service.validateUser('string', 'string');
    expect(user).toBeNull();
  });
  it('should return null if password is wrong', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));
    const user = await service.validateUser('string', 'string');
    expect(user).toBeNull();
  });
});
