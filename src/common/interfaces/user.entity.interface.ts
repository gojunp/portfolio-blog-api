import { IPost } from './post.entity.interface';
import { IProject } from './project.entity.interface';
import { IUserImage } from './user-image.entity.interface';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: IUserImage;
  createdAt: Date;
  posts: IPost[];
  projects: IProject[];
}
