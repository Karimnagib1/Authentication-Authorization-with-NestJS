import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/services/user/user.service';
import { LocalStrategy } from './local-auth.strategy';
import { JwtStrategy } from './jwt-auth.strategy';

import { jwtConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' }, // 24 hours
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
