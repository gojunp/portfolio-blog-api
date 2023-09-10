import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../env-validation';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ImageModule } from './image/image.module';
import { PostImageModule } from './post-image/post-image.module';
import { UserImageModule } from './user-image/user-image.module';
import { ProjectModule } from './project/project.module';
import { ProjectImageModule } from './project-image/project-image.module';
import { DataStorageModule } from './data-storage/data-storage.module';
import { WinstonModule } from 'nest-winston';
import { WinstonLoggerService } from './common/loggers/winston-logger.service';
import { transports } from 'winston'; // Import transports here

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to your entity files
          synchronize: process.env.NODE_ENV === 'development' ? true : false // Auto-create database tables (in development)
        };
      }
    }),
    WinstonModule.forRoot({
      transports: [new transports.Console()]
    }),
    ConfigModule.forRoot({ validate }),
    UserModule,
    AuthModule,
    PostModule,
    ImageModule,
    PostImageModule,
    UserImageModule,
    ProjectModule,
    ProjectImageModule
  ],
  controllers: [AuthController],
  providers: [AuthService, DataStorageModule, WinstonLoggerService],
  exports: [WinstonLoggerService]
})
export class AppModule {}
