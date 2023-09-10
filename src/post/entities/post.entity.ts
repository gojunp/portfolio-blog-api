import { IPost } from 'src/common/interfaces';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { PostImage } from '../../post-image/entities/post-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'post' })
export class Post implements IPost {
  @ApiProperty({ example: '41b1233c-f048-4eba-a0fb-946753a4925b' })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ example: 'Post title' })
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

  @ManyToOne(() => User, (author) => author.posts, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ApiProperty({ example: PostImage })
  @OneToMany(() => PostImage, (image) => image.post, { eager: true })
  postImages: PostImage[];
}
