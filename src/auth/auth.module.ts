require('dotenv').config();
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/constants';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.LOGIN_EXPIRE }
    }),
    UserModule,
    PostModule
  ],
  providers: [AuthService, WinstonLoggerService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
