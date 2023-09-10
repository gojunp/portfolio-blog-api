import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { IUser } from 'src/common/interfaces';

export class CreateUserDto implements Partial<IUser> {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and have at least one lowercase letter, one uppercase letter, one digit, and one special character'
    }
  )
  @ApiProperty({ example: 'Password.123!' })
  password: string;
}
