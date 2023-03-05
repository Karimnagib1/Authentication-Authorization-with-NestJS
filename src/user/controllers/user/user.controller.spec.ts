import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';
import { LocationsService } from '../../../utils/locations/locations.service';
import { AuthService } from '../../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
describe('UserController', () => {
  let controller: UserController;
  const mockUserService = {
    getUserByEmail: jest.fn((email) => {
      return undefined;
    }),

    createUser: jest.fn((userData) => {
      const { password, latitude, longitude, ...result } = userData;
      result.id = 0;
      return result;
    }),
  };
  const mockLocationsService = {
    getLocation: jest.fn((latitude, longitude) => {
      return {
        country: 'United States',
        city: 'string',
        state: 'string',
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: LocationsService, useValue: mockLocationsService },
        AuthService,
        JwtService,
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a user', async () => {
    const user = await controller.userSignup({
      name: 'string',
      email: 'string',
      password: 'string',
      latitude: 0,
      longitude: 0,
    });
    expect(user).toEqual({
      id: 0,
      name: 'string',
      email: 'string',
      city: 'string',
      state: 'string',
    });
    expect(mockUserService.createUser).toHaveBeenCalled();
  });
  it('should throw an error if email already exists', async () => {
    mockUserService.getUserByEmail.mockReturnValueOnce({
      id: 0,
      name: 'string',
      email: 'string',
      city: 'string',
      state: 'string',
    });
    try {
      await controller.userSignup({
        name: 'string',
        email: 'string',
        password: 'string',
        latitude: 0,
        longitude: 0,
      });
    } catch (e) {
      expect(e.message).toEqual('Email already exists');
    }
  });
  it('should throw an error if user is not in USA', async () => {
    mockLocationsService.getLocation.mockReturnValueOnce({
      country: 'string',
      city: 'string',
      state: 'string',
    });
    try {
      await controller.userSignup({
        name: 'string',
        email: 'string',
        password: 'string',
        latitude: 0,
        longitude: 0,
      });
    } catch (e) {
      expect(e.message).toEqual('You must be in the USA to sign up');
    }
  });
  it('shoud get the user with using user_id param', async () => {
    mockUserService.getUserByEmail.mockReturnValueOnce({
      id: 0,
      name: 'string',
      email: 'string',
      city: 'string',
      state: 'string',
    });
    const user = await controller.getProfile({
      params: { user_id: 0 },
      user: {
        id: 0,
        email: 'string',
      },
    });
    expect(user).toEqual({
      name: 'string',
      email: 'string',
      city: 'string',
      state: 'string',
    });
    expect(mockUserService.getUserByEmail).toHaveBeenCalled();
  });
  it('shoud get the user with using user_id param', async () => {
    mockUserService.getUserByEmail.mockReturnValueOnce({
      id: 0,
      name: 'string',
      email: 'string',
      city: 'string',
      state: 'string',
    });
    await expect(
      controller.getProfile({
        params: { user_id: 1 },
        user: {
          id: 0,
          email: 'string',
        },
      }),
    ).rejects.toThrowError(UnauthorizedException);
  });
});
