import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreateUserImageDto {
  @ApiProperty({ example: 1 })
  @IsNumberString()
  userId: number;
}
