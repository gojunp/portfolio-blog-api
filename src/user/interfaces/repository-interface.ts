import { BaseAbstractRepository } from '../../repositories/base/base-abstract-repository';
import { User } from '../entities';

export abstract class AbstractUserRepository extends BaseAbstractRepository<User> {}
