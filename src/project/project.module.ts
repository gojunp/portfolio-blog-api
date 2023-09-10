import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserModule } from '../user/user.module';
import { ProjectRepositoryService } from './services';
import { AbstractProjectRepository } from './interfaces/repository-interface';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UserModule],
  controllers: [ProjectController],
  providers: [
    WinstonLoggerService,
    ProjectService,
    ProjectRepositoryService,
    {
      provide: AbstractProjectRepository,
      useExisting: ProjectRepositoryService
    }
  ],
  exports: [AbstractProjectRepository]
})
export class ProjectModule {}
