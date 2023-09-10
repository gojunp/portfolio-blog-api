import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostImageDto } from './create-post-image.dto';

export class UpdatePostImageDto extends PartialType(CreatePostImageDto) {
  @ApiProperty({ example: 1 })
  order_no: number;
}
