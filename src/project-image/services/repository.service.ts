import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractProjectImageRepository } from '../interfaces/repository-interface';
import { ProjectImage } from '../entities/project-image.entity';

@Injectable()
export class ProjectImageRepositoryService extends AbstractProjectImageRepository {
  constructor(
    @InjectRepository(ProjectImage)
    private readonly projectImageRepository: Repository<ProjectImage>
  ) {
    super(projectImageRepository);
  }
}
