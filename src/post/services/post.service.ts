import { PageOptionsDto } from './../../common/dtos/page-options.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities';
import { Repository } from 'typeorm';
import { Post } from '../entities';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { Order } from '../../common/constants';
import { GetPostArgs, GetPostsArgs } from '../dto';
import { AbstractUserRepository } from '../../user/interfaces/repository-interface';
import { AbstractPostRepository } from '../interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';

@Injectable()
export class PostService {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    @InjectRepository(Post)
    private postRepository: AbstractPostRepository,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    user = await this.userRepository.findOne({
      where: { id: user.id }
    });

    if (!user) throw new NotFoundException('Author not found!');
    const post = this.postRepository.create({ ...createPostDto, author: user });
    return await this.postRepository.save(post);
  }

  async findAll() {
    const result = await this.postRepository.find({});
    if (!result) throw new NotFoundException('Posts Not Found.');
    return result;
  }

  public async listEntities(
    pageOptionsDto: PageOptionsDto,
    sortBy: string,
    orderBy: Order,
    getPostsArgs: GetPostsArgs
  ): Promise<PageDto<Post>> {
    if (!pageOptionsDto.page) pageOptionsDto.page = 1;
    if (!pageOptionsDto.take) pageOptionsDto.take = 10;

    let decodedSortBy = sortBy ? decodeURIComponent(sortBy) : 'created_at';

    if (!orderBy) orderBy = Order.ASC;

    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.postImages', 'postImage')
      .leftJoinAndSelect('postImage.image', 'image')
      .where(
        +getPostsArgs.userId ? 'author.id = :userId' : 'author.id IS NOT NULL',
        { userId: +getPostsArgs.userId }
      );

    queryBuilder.orderBy(`post.${decodedSortBy}`, orderBy);

    queryBuilder.skip(skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(uuid: string) {
    const result = await this.postRepository.findOne({
      where: { uuid }
    });
    if (!result) throw new NotFoundException('Post Not Found.');
    return result;
  }

  async update(uuid: string, updatePostDto: UpdatePostDto) {
    const result = await this.postRepository.findOne({
      where: { uuid }
    });
    if (!result) throw new NotFoundException('Post Not Found.');

    Object.assign(result, updatePostDto);

    return await this.postRepository.save(result);
  }

  async remove(uuid: string) {
    try {
      await this.postRepository.remove({ uuid });
      return `Deleted Post under UUID: ${uuid}`;
    } catch (error) {
      this.logger.error('Post deletion failed', error);
      throw new Error('Post deletion failed!');
    }
  }
}
