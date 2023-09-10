import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { IProject } from '../../common/interfaces/project.entity.interface';
import { User } from '../../user/entities';
import { ProjectImage } from '../../project-image/entities/project-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'project' })
export class Project implements IProject {
  @ApiProperty({ example: '41b1233c-f048-4eba-a0fb-946753a4925b' })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ example: 'Project title' })
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty({ example: 'Description' })
  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @ApiProperty({ example: 'Body' })
  @Column({ type: 'varchar', nullable: true })
  body: string;

  @ApiProperty({ example: 'Time of post creation' })
  @Column({ type: 'timestamptz', default: new Date().toISOString() })
  created_at: Date;

  @ManyToOne(() => User, (author) => author.projects, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ApiProperty({ example: ProjectImage })
  @OneToMany(() => ProjectImage, (image) => image.project, { eager: true })
  projectImages: ProjectImage[];
}
