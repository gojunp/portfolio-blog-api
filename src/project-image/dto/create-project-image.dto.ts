import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateProjectImageDto {
  @ApiProperty({ example: '91e12e84-5871-489b-84f6-0f89cd976722' })
  @IsUUID()
  @IsOptional()
  projectUuid: string;
}
