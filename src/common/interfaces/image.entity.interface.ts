import { IPostImage } from './post-image.entity.interface';
import { IProjectImage } from './project-image.entity.interface';
import { IUserImage } from './user-image.entity.interface';

export interface IImage {
  id: number;
  url: string;
  created_at: Date;
  postImage: IPostImage;
  userImage: IUserImage;
  projectImage: IProjectImage;
}
