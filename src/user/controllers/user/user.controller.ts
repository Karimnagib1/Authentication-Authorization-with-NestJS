import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Post,
  HttpException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/SignUp.dto';
import { UserService } from '../../services/user/user.service';
import { LocationsService } from '../../../utils/locations/locations.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../typeorm';
import { LoginBody, LoginResponse } from '../../abstract-classes';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly locationService: LocationsService,
    private readonly authService: AuthService,
  ) {}

  /** * Registers a new user if not already exists
   *
   * @param Request $ req The request sent
   *
   * @throws UnauthorizedException The id is not the same as the id of the authenticated user

   * @return the user with that id
   */

  @ApiResponse({
    status: 200,
    description: 'The user with that id if authenticated',
    type: User,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':user_id')
  async getProfile(@Request() req: any): Promise<any> {
    if (req.user.id === req.params.user_id) {
      const user = await this.userService.getUserByEmail(req.user.email);
      const { id, password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  /** * Authenticates the user
   *
   * @param Request $ req The request sent
   *
   * @throws UnauthorizedException if the user is not authenticated

   * @return the access token of the authenticated user
   */
  @ApiBody({
    type: LoginBody,
  })
  @ApiResponse({
    status: 200,
    description: 'The access token of the authenticated user',
    type: LoginResponse,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  /** * Registers a new user if not already exists
   *
   * @param SignUpDto $ userData the new user data
   * @throws HttpException If a email already exists
   * @throws HttpException If the user is not in USA
   * @return the newly created user
   *
   */

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request if email exists or not in USA',
  })
  @UsePipes(new ValidationPipe())
  @Post('signup')
  async userSignup(@Body() userData: SignUpDto) {
    const { name, email, password, latitude, longitude } = userData;
    const location = await this.locationService.getLocation(
      latitude,
      longitude,
    );
    if (location.country === 'United States') {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        const newUser = await this.userService.createUser({
          name: name,
          email: email,
          password: password,
          city: location.city,
          state: location.state,
        });
        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          state: newUser.state,
          city: newUser.city,
        };
      } else {
        throw new HttpException('Email already exists', 400);
      }
    } else {
      throw new HttpException('You must be in the USA to sign up', 400);
    }
  }
}
