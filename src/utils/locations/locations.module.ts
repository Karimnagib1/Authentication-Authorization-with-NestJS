import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Module({})
@Module({
  controllers: [],
  providers: [LocationsService],
  imports: [],
})
export class LocationsModule {}
