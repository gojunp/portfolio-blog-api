import { IImage } from './image.entity.interface';
import { IPost } from './post.entity.interface';

export interface IPostImage {
  id: number;
  order_no: number;
  image: IImage;
  post: IPost;
}
