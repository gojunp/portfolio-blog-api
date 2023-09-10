import { Injectable } from '@nestjs/common';
import { AbstractUserRepository } from '../interfaces/repository-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepositoryService extends AbstractUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository);
  }
}
