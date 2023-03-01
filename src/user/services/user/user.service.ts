import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  
  getProfile(userId: number) {
    return {
      userId,
      name: 'John Doe',
      email: 'example@example.com',
      latitude: 0,
      longitude: 0,
    };
  }
}
