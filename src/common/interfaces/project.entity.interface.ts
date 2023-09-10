import { IProjectImage } from './project-image.entity.interface';
import { IUser } from './user.entity.interface';

export interface IProject {
  uuid: string;
  author: IUser;
  title: string;
  description: string;
  body: string;
  created_at: Date;
  projectImages: IProjectImage[];
}
