import {
  Controller,
  Get,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/SignUp.dto';
import { UserService } from 'src/user/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':user_id')
  getProfile(@Param('user_id', ParseIntPipe) userId: number) {
    return this.userService.getProfile(userId);
  }
  @UsePipes(new ValidationPipe())
  @Post('signup')
  userSignup(@Body() userData: SignUpDto) {
    const { name, email, latitude, longitude } = userData;
  }
}
