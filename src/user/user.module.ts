import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AbstractUserRepository } from './interfaces/repository-interface';
import { UserRepositoryService } from './services';
import { WinstonModule } from 'nest-winston';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    WinstonLoggerService,
    UserService,
    UserRepositoryService,
    { provide: AbstractUserRepository, useExisting: UserRepositoryService }
  ],
  exports: [AbstractUserRepository]
})
export class UserModule {}
