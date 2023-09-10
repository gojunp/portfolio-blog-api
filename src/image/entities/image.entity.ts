import { IImage } from 'src/common/interfaces';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostImage } from '../../post-image/entities/post-image.entity';
import { UserImage } from '../../user-image/entities/user-image.entity';
import { ProjectImage } from '../../project-image/entities/project-image.entity';

@Entity({ name: 'image' })
export class Image implements IImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  url: string;

  @Column({ type: 'timestamptz', default: new Date().toISOString() })
  created_at: Date;

  @OneToOne(() => PostImage, (postImage) => postImage.image, { nullable: true })
  postImage: PostImage;

  @OneToOne(() => UserImage, (userImage) => userImage.image, { nullable: true })
  userImage: UserImage;

  @OneToOne(() => ProjectImage, (projectImage) => projectImage.image, {
    nullable: true
  })
  projectImage: ProjectImage;
}
