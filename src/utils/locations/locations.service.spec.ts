import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import axios from 'axios';

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get location', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: {
          data: [
            {
              country: 'string',
              region: 'string',
              locality: 'string',
            },
          ],
        },
      }),
    );

    const location = await service.getLocation(1, 1);

    expect(location).toEqual({
      country: 'string',
      state: 'string',
      city: 'string',
    });
    jest.restoreAllMocks();
  });
  it('should return empty location', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({}));

    const location = await service.getLocation(1, 1);

    expect(location).toEqual({
      country: '',
      state: '',
      city: '',
    });
    jest.restoreAllMocks();
  });
});
