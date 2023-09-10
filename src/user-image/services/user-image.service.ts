import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities';
import { Repository } from 'typeorm';
import { UserImage } from '../entities/user-image.entity';
import { ConfigService } from '@nestjs/config';
import { DataStorageService } from '../../data-storage/data-storage.service';
import { AbstractUserRepository } from '../../user/interfaces/repository-interface';
import { AbstractImageRepository } from '../../image/interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';

@Injectable()
export class UserImageService {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly imageRepository: AbstractImageRepository,
    @InjectRepository(UserImage)
    private userImageRepository: Repository<UserImage>,
    private readonly dataStorageService: DataStorageService,
    private readonly configService: ConfigService,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  async create(user: User, file: Express.Multer.File): Promise<UserImage> {
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id }
    });
    [];
    if (!currentUser) throw new NotFoundException('User not found!');
    if (currentUser.profileImage)
      throw new ConflictException(
        'You already have a profile image. Remove the existing one first.'
      );

    const url = await this.dataStorageService.uploadToStorage(
      `user-image/${file.originalname}`,
      file
    );

    const image = this.imageRepository.create({
      url: url
    });

    const UserImage = this.userImageRepository.create({
      image,
      user: currentUser
    });
    return await this.userImageRepository.save(UserImage);
  }

  async findAll(): Promise<UserImage[]> {
    const result = await this.userImageRepository.find();
    if (!result) throw new NotFoundException('User images Not Found.');
    return result;
  }

  async findOne(id: number): Promise<UserImage> {
    const result = await this.userImageRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('User image Not Found.');
    return result;
  }

  /*   async update(
    id: number,
    updateUserImageDto: UpdateUserImageDto
  ): Promise<UserImage> {} */

  async remove(id: number): Promise<void> {
    const userImage = await this.userImageRepository.findOne({ where: { id } });
    if (!userImage) throw new NotFoundException('User image not found');

    const cdnSuffix = this.configService.get<string>('CDN_SUFFIX');

    const imageUrl = userImage.image.url.split(`${cdnSuffix}/`)[1];
    await this.dataStorageService.deleteFromStorage(imageUrl);

    try {
      await this.userImageRepository.delete(id);
    } catch (error) {
      this.logger.error('User image deletion failed', error);
      throw new Error('User image deletion failed.');
    }
  }
}
