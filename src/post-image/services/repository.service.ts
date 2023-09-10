import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractPostImageRepository } from '../interfaces/repository-interface';
import { PostImage } from '../entities/post-image.entity';

@Injectable()
export class PostImageRepositoryService extends AbstractPostImageRepository {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>
  ) {
    super(postImageRepository);
  }
}
