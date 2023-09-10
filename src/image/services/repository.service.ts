import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractImageRepository } from '../interfaces/repository-interface';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageRepositoryService extends AbstractImageRepository {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {
    super(imageRepository);
  }
}
