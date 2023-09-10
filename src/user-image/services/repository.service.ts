import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractUserImageRepository } from '../interfaces/repository-interface';
import { UserImage } from '../entities/user-image.entity';

@Injectable()
export class UserImageRepositoryService extends AbstractUserImageRepository {
  constructor(
    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>
  ) {
    super(userImageRepository);
  }
}
