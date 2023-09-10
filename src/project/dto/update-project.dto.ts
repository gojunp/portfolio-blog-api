import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ example: '91e12e84-5871-489b-84f6-0f89cd976722' })
  uuid: string;
}
