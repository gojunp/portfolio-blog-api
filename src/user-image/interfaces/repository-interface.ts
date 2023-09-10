import { BaseAbstractRepository } from '../../repositories/base/base-abstract-repository';
import { UserImage } from '../entities/user-image.entity';

export abstract class AbstractUserImageRepository extends BaseAbstractRepository<UserImage> {}
