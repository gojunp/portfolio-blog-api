import { IsNumberString, IsOptional, IsUUID } from 'class-validator';
import { IPost } from '../../common/interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostsArgs implements Partial<IPost> {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  userId: number;

  @IsUUID()
  @IsOptional()
  uuid: string;
}
