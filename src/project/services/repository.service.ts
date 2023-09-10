import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { AbstractProjectRepository } from '../interfaces/repository-interface';

@Injectable()
export class ProjectRepositoryService extends AbstractProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {
    super(projectRepository);
  }
}
