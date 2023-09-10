import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import UserRequest from '../common/interfaces/user-request.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/middleware/current.user';
import { User } from '../user/entities';
import { AuthArgs } from './args/auth-args';
import { AuthGuard } from '../common/guards';
import { ChangePasswordArgs } from './args/change-password-args';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() authArgs: AuthArgs, @Req() req: UserRequest) {
    return this.authService.login(authArgs, req);
  }

  /*  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  } */

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'User Change Password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(@CurrentUser() user: User, @Body() args: ChangePasswordArgs) {
    return this.authService.changePassword(user, args);
  }
}
