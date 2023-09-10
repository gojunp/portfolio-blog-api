import { IImage } from './image.entity.interface';
import { IUser } from './user.entity.interface';

export interface IUserImage {
  id: number;
  user: IUser;
  image: IImage;
}
