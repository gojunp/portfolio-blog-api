import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult
} from 'typeorm';
import { BaseRepository } from '../../interfaces/base-repository-interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseAbstractRepository<T> implements BaseRepository<T> {
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  create(entity: DeepPartial<T>): T {
    return this.entity.create(entity);
  }

  createQueryBuilder(entity: string): SelectQueryBuilder<T> {
    return this.entity.createQueryBuilder(entity);
  }

  async save(data: T): Promise<T> {
    return await this.entity.save(data);
  }

  async findOne(where: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(where);
  }

  async update(
    criteria: any,
    entity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    return await this.entity.update(criteria, entity);
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return await this.entity.findBy(where);
  }

  async remove(criteria: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.entity.delete(criteria);
  }
}
