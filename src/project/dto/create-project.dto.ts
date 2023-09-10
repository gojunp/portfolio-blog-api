import { ApiProperty } from '@nestjs/swagger';
import { IProject } from '../../common/interfaces/project.entity.interface';

export class CreateProjectDto implements Partial<IProject> {
  @ApiProperty({ example: 'Title' })
  title: string;

  @ApiProperty({ example: 'This is a short description.' })
  description: string;

  @ApiProperty({ example: 'This is a project body' })
  body: string;
}
