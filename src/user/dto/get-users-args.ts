import { IUser } from '../../common/interfaces';

export class GetUsersArgs implements Partial<IUser> {
  id?: number;
}
