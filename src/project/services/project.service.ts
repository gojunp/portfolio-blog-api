import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { Project } from '../entities/project.entity';
import { CreateProjectDto, GetProjectArgs, UpdateProjectDto } from '../dto';
import { Order } from '../../common/constants';
import { GetProjectsArgs } from '../dto/get-projects-args';
import { AbstractUserRepository } from '../../user/interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    user = await this.userRepository.findOne({
      where: { id: user.id }
    });

    if (!user) throw new NotFoundException('Author not found!');
    const post = this.projectRepository.create({
      ...createProjectDto,
      author: user
    });
    return await this.projectRepository.save(post);
  }

  async findAll(where: GetProjectsArgs) {
    const result = await this.projectRepository.find({ where });
    if (!result) throw new NotFoundException('Projects Not Found.');
    return result;
  }

  public async listEntities(
    pageOptionsDto: PageOptionsDto,
    sortBy: string,
    orderBy: Order,
    getProjectsArgs: GetProjectsArgs
  ): Promise<PageDto<Project>> {
    if (!pageOptionsDto.page) pageOptionsDto.page = 1;
    if (!pageOptionsDto.take) pageOptionsDto.take = 10;
    if (!pageOptionsDto.order) pageOptionsDto.order = Order.ASC;

    let decodedSortBy = sortBy ? decodeURIComponent(sortBy) : 'created_at';

    if (!orderBy) orderBy = Order.ASC;

    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.author', 'author')
      .leftJoinAndSelect('project.projectImages', 'projectImage')
      .leftJoinAndSelect('projectImage.image', 'image')
      .where(
        +getProjectsArgs.userId
          ? 'author.id = :userId'
          : 'author.id IS NOT NULL',
        { userId: +getProjectsArgs.userId }
      );
    queryBuilder;
    queryBuilder
      .orderBy(`project.${decodedSortBy}`, orderBy)
      .skip(skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(uuid: string) {
    const result = await this.projectRepository.findOne({
      where: { uuid }
    });
    if (!result) throw new NotFoundException('Project Not Found.');
    return result;
  }

  async update(uuid: string, updateProjectDto: UpdateProjectDto) {
    const result = await this.projectRepository.findOne({
      where: { uuid: uuid }
    });
    if (!result) throw new NotFoundException('Project Not Found.');

    Object.assign(result, updateProjectDto);

    return await this.projectRepository.save(result);
  }

  async remove(uuid: string) {
    try {
      await this.projectRepository.delete(uuid);
      return `Deleted Project under UUID: ${uuid}`;
    } catch (error) {
      this.logger.error('Project deletion failed', error);
      throw new Error('Project deletion failed!');
    }
  }
}
