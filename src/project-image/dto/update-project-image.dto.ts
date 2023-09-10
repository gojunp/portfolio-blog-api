import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectImageDto } from './create-project-image.dto';

export class UpdateProjectImageDto extends PartialType(CreateProjectImageDto) {
  @ApiProperty({ example: 1 })
  order_no: number;
}
