import { IProjectImage } from '../../common/interfaces';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { Project } from '../../project/entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'project_image' })
export class ProjectImage implements IProjectImage {
  @ApiProperty({ example: 123 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'integer', nullable: true })
  order_no: number;

  @ManyToOne(() => Project, (project) => project.projectImages)
  @JoinColumn({ name: 'project_uuid' })
  project: Project;

  @OneToOne(() => Image, (image) => image.postImage, {
    eager: true,
    cascade: true
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
