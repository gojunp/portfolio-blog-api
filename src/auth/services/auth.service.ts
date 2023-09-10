import { CreateUserDto } from '../../user/dto/create-user.dto';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Inject
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities';
import UserRequest from '../../common/interfaces/user-request.interface';
import { AbstractUserRepository } from '../../user/interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';
import { AuthArgs } from '../args/auth-args';
import { ChangePasswordArgs } from '../args/change-password-args';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private jwtService: JwtService,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  async login(authArgs: AuthArgs, req: UserRequest): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: authArgs.email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true
      }
    });
    if (!user) throw new UnauthorizedException('Invalid credentials!');

    const passwordsMatch = await bcrypt.compare(
      authArgs.password,
      user.password
    );
    if (!passwordsMatch)
      throw new UnauthorizedException('Invalid credentials!');
    const payload = { sub: user.id, username: user.email };

    const access_token = await this.jwtService.signAsync(payload);

    delete user.password;

    req.user = user;

    return access_token;
  }

  /* async register(input: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: input.email }
    });
    if (user)
      throw new ConflictException('User with this email already exists!');

    const newUser = this.userRepository.create(input);
    return await this.userRepository.save(newUser);
  } */

  async changePassword(user: User, args: ChangePasswordArgs) {
    console.log(args);
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: { id: true, password: true }
    });
    if (!currentUser) throw new NotFoundException('User Not Found');

    console.log(currentUser);

    const isPasswordValid = await bcrypt.compare(
      args.oldPassword,
      currentUser.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Hash and update the new password in the database
    const newPasswordHash = await bcrypt.hash(args.newPassword, 10);
    currentUser.password = newPasswordHash;
    try {
      await this.userRepository.save(currentUser);
    } catch (error) {
      this.logger.error(error, 'User password update has failed.');
      throw new InternalServerErrorException(
        'User password update has failed.'
      );
    }
  }
}
