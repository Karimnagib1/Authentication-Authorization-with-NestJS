import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Location } from './interfaces/location.interface';
@Injectable()
export class LocationsService {
  /** * Gets the address from the geographic coordinates
   *
   * @param number $latitude The first geographic coordinate
   * @param number $longitude The second geographic coordinate
   *
   * @return the address components (country, state, city) encapsulated in an object or undefined
   */

  getLocation = async (
    latitude: number,
    longitude: number,
  ): Promise<Location> => {
    const params = {
      access_key: 'a262219ebcc858da586bb2d96cf00e90',
      query: `${latitude},${longitude}`,
    };
    try {
      const response = await axios.get(
        'http://api.positionstack.com/v1/reverse',
        {
          params,
        },
      );
      return {
        country: response.data.data[0].country,
        state: response.data.data[0].region,
        city: response.data.data[0].locality,
      };
    } catch (error) {
      return { country: '', state: '', city: '' };
    }
  };
}
