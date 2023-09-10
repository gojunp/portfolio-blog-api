import { Request } from 'express';
import { User } from '../../user/entities';

interface UserRequest extends Request {
  user: User;
}

export default UserRequest;
