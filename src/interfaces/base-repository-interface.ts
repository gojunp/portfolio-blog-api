import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface BaseRepository<T> {
  create(entity: DeepPartial<T>): T;

  save(data: T): Promise<T>;

  findOne(where: FindOneOptions<T>): Promise<T>;

  update(
    criteria: any,
    entity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult>;

  find(where: FindManyOptions<T>): Promise<T[]>;

  remove(criteria: FindOptionsWhere<T>): Promise<DeleteResult>;
}
