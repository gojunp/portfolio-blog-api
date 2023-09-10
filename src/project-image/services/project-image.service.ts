import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectImageDto } from '../dto/create-project-image.dto';
import { UpdateProjectImageDto } from '../dto/update-project-image.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectImage } from '../entities/project-image.entity';
import { DataStorageService } from '../../data-storage/data-storage.service';
import { ConfigService } from '@nestjs/config';
import { AbstractProjectRepository } from '../../project/interfaces/repository-interface';
import { AbstractImageRepository } from '../../image/interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';

@Injectable()
export class ProjectImageService {
  constructor(
    private readonly projectRepository: AbstractProjectRepository,
    private readonly imageRepository: AbstractImageRepository,
    @InjectRepository(ProjectImage)
    private projectImageRepository: Repository<ProjectImage>,
    private readonly dataStorageService: DataStorageService,
    private readonly configService: ConfigService,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  async create(
    createProjectImageDto: CreateProjectImageDto,
    files: Express.Multer.File[]
  ): Promise<boolean> {
    const project = await this.projectRepository.findOne({
      where: { uuid: createProjectImageDto.projectUuid }
    });
    if (!project) throw new NotFoundException('Project not found!');

    for (const file of files) {
      try {
        const lastImage = await this.projectImageRepository.findOne({
          where: { project: { uuid: project.uuid } },
          order: { order_no: 'DESC' } // Get the last image by order number
        });

        const url = await this.dataStorageService.uploadToStorage(
          `project-image/${file.originalname}`,
          file
        );

        const image = this.imageRepository.create({
          url: url
        });

        const postImage = this.projectImageRepository.create({
          image,
          project,
          order_no: lastImage ? lastImage.order_no + 1 : 1
        });
        await this.projectImageRepository.save(postImage);
      } catch (error) {
        this.logger.error('Image upload failed', error);
        throw new Error('Image upload failed');
      }
    }
    return true;
  }
  async findAll(): Promise<ProjectImage[]> {
    const result = await this.projectImageRepository.find();
    if (!result) throw new NotFoundException('Project images Not Found.');
    return result;
  }

  async findOne(id: number): Promise<ProjectImage> {
    const result = await this.projectImageRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('Project image Not Found.');
    return result;
  }

  async update(
    id: number,
    updateProjectImageDto: UpdateProjectImageDto
  ): Promise<ProjectImage> {
    //Left the update method logic for possible need in the future
    if (updateProjectImageDto.order_no) {
      this.updateImageOrder(id, +updateProjectImageDto.order_no);
    }
    return this.projectImageRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    const imageToDelete = await this.projectImageRepository.findOne({
      where: { id },
      relations: { project: true }
    });
    if (!imageToDelete) {
      throw new Error('Project image not found');
    }

    const orderNumber = imageToDelete.order_no;

    const cdnSuffix = this.configService.get<string>('CDN_SUFFIX');

    const imageUrl = imageToDelete.image.url.split(`${cdnSuffix}/`)[1];
    await this.dataStorageService.deleteFromStorage(imageUrl);

    // Delete the image
    try {
      await this.projectImageRepository.delete(id);
    } catch (error) {
      this.logger.error('Project image deletion failed', error);
      throw new Error('Project image deletion failed.');
    }

    // Get the images that need to be adjusted
    const imagesToAdjust = await this.projectImageRepository.find({
      order: { order_no: 'ASC' },
      where: { project: { uuid: imageToDelete.project.uuid } }
    });

    // Update the order numbers accordingly
    for (const image of imagesToAdjust) {
      if (image.order_no > orderNumber) {
        image.order_no--;
      }
    }

    await this.projectImageRepository.save(imagesToAdjust);
  }

  async updateImageOrder(
    projectImageId: number,
    newOrder: number
  ): Promise<void> {
    const imageToUpdate = await this.projectImageRepository.findOne({
      where: { id: projectImageId },
      relations: { project: true }
    });
    if (!imageToUpdate) {
      throw new Error('Project image not found');
    }

    const currentOrder = imageToUpdate.order_no;

    // Determine whether we're moving the image forward or backward in the order
    const shiftDirection = newOrder > currentOrder ? 'forward' : 'backward';

    // Get the images that need to be adjusted
    const imagesToAdjust = await this.projectImageRepository.find({
      order: { order_no: 'ASC' },
      where: { project: { uuid: imageToUpdate.project.uuid } }
    });

    // Update the order numbers accordingly
    for (const image of imagesToAdjust) {
      if (image.id === projectImageId) {
        image.order_no = newOrder;
      } else {
        if (shiftDirection === 'forward') {
          if (image.order_no > currentOrder && image.order_no <= newOrder) {
            image.order_no--;
          }
        } else {
          if (image.order_no < currentOrder && image.order_no >= newOrder) {
            image.order_no++;
          }
        }
      }
    }

    await this.projectImageRepository.save(imagesToAdjust);
  }
}
