import { BaseAbstractRepository } from '../../repositories/base/base-abstract-repository';
import { Post } from '../entities';

export abstract class AbstractPostRepository extends BaseAbstractRepository<Post> {}
