import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { AbstractUserRepository } from '../interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: AbstractUserRepository,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  /*  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      this.logger.error('User creation failed', error);
      throw new Error(error.message);
    }
  } */

  async findAll(): Promise<User[]> {
    const result = await this.userRepository.find({});
    if (!result) throw new NotFoundException('Users Not Found.');
    return result;
  }

  async findOne(id: number): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('User Not Found.');
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('User Not Found.');

    Object.assign(result, updateUserDto);

    return await this.userRepository.save(result);
  }

  async remove(id: number): Promise<User> {
    try {
      const result = await this.userRepository.findOne({
        where: { id }
      });
      await this.userRepository.remove({ id });
      return result;
    } catch (error) {
      this.logger.error('User deletion failed', error);
      throw new Error('User deletion failed!');
    }
  }
}
