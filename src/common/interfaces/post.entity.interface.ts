import { IPostImage } from './post-image.entity.interface';
import { IUser } from './user.entity.interface';

export interface IPost {
  uuid: string;
  author: IUser;
  title: string;
  description: string;
  body: string;
  created_at: Date;
  postImages: IPostImage[];
}
