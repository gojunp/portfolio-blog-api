import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { IUserImage } from '../../common/interfaces/user-image.entity.interface';
import { User } from '../../user/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user_image' })
export class UserImage implements IUserImage {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 123 })
  id: number;

  @OneToOne(() => User, (user) => user.profileImage)
  user: User;

  @OneToOne(() => Image, (image) => image.userImage, {
    eager: true,
    cascade: true
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
