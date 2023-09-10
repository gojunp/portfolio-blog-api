import { IPostImage } from 'src/common/interfaces';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Post } from '../../post/entities';
import { Image } from '../../image/entities/image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'post_image' })
export class PostImage implements IPostImage {
  @ApiProperty({ example: 123 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'integer', nullable: true })
  order_no: number;

  @ManyToOne(() => Post, (post) => post.postImages)
  @JoinColumn({ name: 'post_uuid' })
  post: Post;

  @OneToOne(() => Image, (image) => image.postImage, {
    eager: true,
    cascade: true
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
