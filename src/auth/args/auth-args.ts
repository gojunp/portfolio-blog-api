import { IAuthArgs } from './../../interfaces/auth-args.interface';
import { ApiProperty } from '@nestjs/swagger';

export class AuthArgs implements IAuthArgs {
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Test.123' })
  password: string;
}
