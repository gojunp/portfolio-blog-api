import { Module } from '@nestjs/common';
import { PostImageService } from './services/post-image.service';
import { PostImageController } from './post-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './entities/post-image.entity';
import { PostModule } from '../post/post.module';
import { ImageModule } from '../image/image.module';
import { DataStorageModule } from '../data-storage/data-storage.module';
import { ConfigModule } from '@nestjs/config';
import { PostImageRepositoryService } from './services';
import { AbstractPostImageRepository } from './interfaces/repository-interface';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostImage]),
    PostModule,
    ImageModule,
    DataStorageModule,
    ConfigModule
  ],
  controllers: [PostImageController],
  providers: [
    WinstonLoggerService,
    PostImageService,
    PostImageRepositoryService,
    {
      provide: AbstractPostImageRepository,
      useExisting: PostImageRepositoryService
    }
  ],
  exports: [AbstractPostImageRepository]
})
export class PostImageModule {}
