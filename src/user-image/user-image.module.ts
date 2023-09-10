import { Module } from '@nestjs/common';
import { UserImageService } from './services/user-image.service';
import { UserImageController } from './user-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserImage } from './entities/user-image.entity';
import { UserModule } from '../user/user.module';
import { ImageModule } from '../image/image.module';
import { DataStorageModule } from '../data-storage/data-storage.module';
import { ConfigModule } from '@nestjs/config';
import { UserImageRepositoryService } from './services/repository.service';
import { AbstractUserImageRepository } from './interfaces/repository-interface';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserImage]),
    UserModule,
    ImageModule,
    DataStorageModule,
    ConfigModule
  ],
  controllers: [UserImageController],
  providers: [
    WinstonLoggerService,
    UserImageService,
    UserImageRepositoryService,
    {
      provide: AbstractUserImageRepository,
      useExisting: UserImageRepositoryService
    }
  ],
  exports: [AbstractUserImageRepository]
})
export class UserImageModule {}
