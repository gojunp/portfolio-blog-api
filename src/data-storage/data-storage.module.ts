import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataStorageService } from './data-storage.service';
import { IDataStorageServiceToken } from '../common/interfaces';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [ConfigModule],
  providers: [
    DataStorageService,
    WinstonLoggerService,
    { provide: IDataStorageServiceToken, useClass: DataStorageService }
  ],
  exports: [DataStorageService, IDataStorageServiceToken]
})
export class DataStorageModule {}
