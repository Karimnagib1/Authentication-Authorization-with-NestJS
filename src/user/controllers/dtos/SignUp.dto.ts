import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignUpDto {
  @ApiProperty({
    example: 'string',
    description: 'The name of the User',
    required: true,
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 'string',
    description: 'The email of the User',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'string',
    description: 'The password of the User',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 0,
    description: 'The latitude of the User',
    required: true,
  })
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    example: 0,
    description: 'The longitude of the User',
    required: true,
  })
  @IsNotEmpty()
  longitude: number;
}
