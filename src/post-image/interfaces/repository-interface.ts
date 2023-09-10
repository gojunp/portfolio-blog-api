import { BaseAbstractRepository } from '../../repositories/base/base-abstract-repository';
import { PostImage } from '../entities/post-image.entity';

export abstract class AbstractPostImageRepository extends BaseAbstractRepository<PostImage> {}
