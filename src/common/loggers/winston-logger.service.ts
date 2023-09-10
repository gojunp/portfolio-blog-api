// src/winston-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { transports, createLogger, format } from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console() // Log to the console
        // Add more transports as needed (e.g., file, remote service)
      ]
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
