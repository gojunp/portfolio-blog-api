import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities';
import { AbstractPostRepository } from './interfaces/repository-interface';
import { PostRepositoryService } from './services';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [
    WinstonLoggerService,
    PostService,
    PostRepositoryService,
    { provide: AbstractPostRepository, useExisting: PostRepositoryService }
  ],
  exports: [AbstractPostRepository]
})
export class PostModule {}
