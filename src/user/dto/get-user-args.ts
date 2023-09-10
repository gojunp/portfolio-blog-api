import { IsNumber } from 'class-validator';
import { IUser } from '../../common/interfaces';

export class GetUserArgs implements Partial<IUser> {
  @IsNumber()
  id: number;
}
