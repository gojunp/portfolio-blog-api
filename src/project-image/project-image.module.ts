import { Module } from '@nestjs/common';
import { ProjectImageService } from './services/project-image.service';
import { ProjectImageController } from './project-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectImage } from './entities/project-image.entity';
import { ProjectModule } from '../project/project.module';
import { DataStorageModule } from '../data-storage/data-storage.module';
import { ImageModule } from '../image/image.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectImageRepositoryService } from './services/repository.service';
import { AbstractProjectImageRepository } from './interfaces/repository-interface';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectImage]),
    ProjectModule,
    ImageModule,
    DataStorageModule,
    ConfigModule
  ],
  controllers: [ProjectImageController],
  providers: [
    WinstonLoggerService,
    ProjectImageService,
    ProjectImageRepositoryService,
    {
      provide: AbstractProjectImageRepository,
      useExisting: ProjectImageRepositoryService
    }
  ],
  exports: [AbstractProjectImageRepository]
})
export class ProjectImageModule {}
