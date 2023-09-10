import { IPost } from '../../common/interfaces';

export class GetPostArgs implements Partial<IPost> {
  uuid?: string;
}
