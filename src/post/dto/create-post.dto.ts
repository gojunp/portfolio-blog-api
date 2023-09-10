import { ApiProperty } from '@nestjs/swagger';
import { IPost } from 'src/common/interfaces';

export class CreatePostDto implements Partial<IPost> {
  @ApiProperty({ example: 'Title' })
  title: string;

  @ApiProperty({ example: 'This is a short description.' })
  description: string;

  @ApiProperty({ example: 'This is a post body' })
  body: string;
}
