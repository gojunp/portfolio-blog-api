import { BaseAbstractRepository } from '../../repositories/base/base-abstract-repository';
import { Image } from '../entities/image.entity';

export abstract class AbstractImageRepository extends BaseAbstractRepository<Image> {}
