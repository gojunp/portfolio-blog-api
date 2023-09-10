import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ example: '91e12e84-5871-489b-84f6-0f89cd976722' })
  uuid: string;
}
