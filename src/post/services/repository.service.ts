import { Injectable } from '@nestjs/common';
import { AbstractPostRepository } from '../interfaces/repository-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities';

@Injectable()
export class PostRepositoryService extends AbstractPostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {
    super(postRepository);
  }
}
