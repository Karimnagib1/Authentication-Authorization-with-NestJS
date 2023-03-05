import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../typeorm';

import * as bcrypt from 'bcrypt';
describe('UserService', () => {
  let service: UserService;

  const repositoryMock = {
    create: jest.fn((user) => {
      return { ...user, id: 1 };
    }),
    save: jest.fn((user) => {
      return user;
    }),
    findBy: jest.fn((user) => {
      return [
        {
          id: 1,
          name: 'string',
          email: 'string',
          password: 'string',
          state: 'string',
          city: 'string',
        },
      ];
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(User), useValue: repositoryMock },

        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('string'));
    const user = await service.createUser({
      name: 'string',
      email: 'string',
      password: 'string',
      state: 'string',
      city: 'string',
    });

    expect(repositoryMock.create).toBeCalled();
    expect(repositoryMock.save).toBeCalled();
    expect(user).toEqual({
      id: 1,
      name: 'string',
      email: 'string',
      password: 'string',
      state: 'string',
      city: 'string',
    });
  });
  it('should get user by email', async () => {
    const user = await service.getUserByEmail('string');

    expect(user).toEqual({
      id: 1,
      name: 'string',
      email: 'string',
      password: 'string',
      state: 'string',
      city: 'string',
    });
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
