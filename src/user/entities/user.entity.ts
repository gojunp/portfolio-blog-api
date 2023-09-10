import { IUser } from 'src/common/interfaces';
import { Post } from '../../post/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserImage } from '../../user-image/entities/user-image.entity';
import { Project } from '../../project/entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ example: 'John' })
  @Column({ type: 'varchar', name: 'first_name', length: 20 })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({ type: 'varchar', name: 'last_name', length: 20 })
  lastName: string;

  @ApiProperty({ example: 'test@test.com' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({ example: 'Test.1234!' })
  @Column({ type: 'varchar', select: false })
  password: string;

  @ApiProperty({ example: UserImage })
  @OneToOne(() => UserImage, (image) => image.user, {
    eager: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'profile_image_id' })
  profileImage: UserImage;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    default: new Date().toISOString()
  })
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.author, {
    nullable: true
  })
  posts: Post[];

  @OneToMany(() => Project, (project) => project.author, {
    nullable: true
  })
  projects: Project[];
}
