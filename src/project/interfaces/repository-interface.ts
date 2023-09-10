import { BaseAbstractRepository } from '../../repositories/base/base-abstract-repository';
import { Project } from '../entities/project.entity';

export abstract class AbstractProjectRepository extends BaseAbstractRepository<Project> {}
