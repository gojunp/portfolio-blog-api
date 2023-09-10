import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { ImageService } from './services/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { Image } from './entities/image.entity';
import { ConfigModule } from '@nestjs/config';
import { DataStorageModule } from '../data-storage/data-storage.module';
import { ImageRepositoryService } from './services';
import { AbstractImageRepository } from './interfaces/repository-interface';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    UserModule,
    PostModule,
    DataStorageModule,
    ConfigModule
  ],
  providers: [
    WinstonLoggerService,
    ImageService,
    ImageRepositoryService,
    {
      provide: AbstractImageRepository,
      useExisting: ImageRepositoryService
    }
  ],
  exports: [AbstractImageRepository]
})
export class ImageModule {}
