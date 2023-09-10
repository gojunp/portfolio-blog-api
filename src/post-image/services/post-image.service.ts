import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostImageDto } from '../dto/create-post-image.dto';
import { UpdatePostImageDto } from '../dto/update-post-image.dto';
import { PostImage } from '../entities/post-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataStorageService } from '../../data-storage/data-storage.service';
import { ConfigService } from '@nestjs/config';
import { AbstractPostRepository } from '../../post/interfaces/repository-interface';
import { AbstractImageRepository } from '../../image/interfaces/repository-interface';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';

@Injectable()
export class PostImageService {
  constructor(
    private readonly postRepository: AbstractPostRepository,
    private readonly imageRepository: AbstractImageRepository,
    @InjectRepository(PostImage)
    private postImageRepository: Repository<PostImage>,
    private readonly dataStorageService: DataStorageService,
    private readonly configService: ConfigService,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  async create(
    createPostImageDto: CreatePostImageDto,
    files: Express.Multer.File[]
  ): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { uuid: createPostImageDto.postUuid }
    });
    if (!post) throw new NotFoundException('Post not found!');

    for (const file of files) {
      try {
        const lastImage = await this.postImageRepository.findOne({
          where: { post: { uuid: post.uuid } },
          order: { order_no: 'DESC' } // Get the last image by order number
        });

        const url = await this.dataStorageService.uploadToStorage(
          `post-image/${file.originalname}`,
          file
        );

        const image = this.imageRepository.create({
          url: url
        });

        const postImage = this.postImageRepository.create({
          image,
          post,
          order_no: lastImage ? lastImage.order_no + 1 : 1
        });
        await this.postImageRepository.save(postImage);
      } catch (error) {
        this.logger.error('Image upload failed', error);
        throw new Error('Image upload failed');
      }
    }
    return true;
  }
  async findAll(): Promise<PostImage[]> {
    const result = await this.postImageRepository.find();
    if (!result) throw new NotFoundException('Post images Not Found.');
    return result;
  }

  async findOne(id: number): Promise<PostImage> {
    const result = await this.postImageRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('Post image Not Found.');
    return result;
  }

  async update(
    id: number,
    updatePostImageDto: UpdatePostImageDto
  ): Promise<PostImage> {
    //Left the update method logic for possible need in the future
    if (updatePostImageDto.order_no) {
      this.updateImageOrder(id, +updatePostImageDto.order_no);
    }
    return this.postImageRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    const imageToDelete = await this.postImageRepository.findOne({
      where: { id },
      relations: { post: true }
    });
    if (!imageToDelete) {
      throw new Error('Post image not found');
    }

    const orderNumber = imageToDelete.order_no;

    const cdnSuffix = this.configService.get<string>('CDN_SUFFIX');

    const imageUrl = imageToDelete.image.url.split(`${cdnSuffix}/`)[1];
    await this.dataStorageService.deleteFromStorage(imageUrl);

    // Delete the image
    try {
      await this.postImageRepository.delete(id);
    } catch (error) {
      this.logger.error('Post image deletion failed', error);
      throw new Error('Post image deletion failed.');
    }

    // Get the images that need to be adjusted
    const imagesToAdjust = await this.postImageRepository.find({
      order: { order_no: 'ASC' },
      where: { post: { uuid: imageToDelete.post.uuid } }
    });

    // Update the order numbers accordingly
    for (const image of imagesToAdjust) {
      if (image.order_no > orderNumber) {
        image.order_no--;
      }
    }

    await this.postImageRepository.save(imagesToAdjust);
  }

  async updateImageOrder(postImageId: number, newOrder: number): Promise<void> {
    const imageToUpdate = await this.postImageRepository.findOne({
      where: { id: postImageId },
      relations: { post: true }
    });
    if (!imageToUpdate) {
      throw new Error('Post image not found');
    }

    const currentOrder = imageToUpdate.order_no;

    // Determine whether we're moving the image forward or backward in the order
    const shiftDirection = newOrder > currentOrder ? 'forward' : 'backward';

    // Get the images that need to be adjusted
    const imagesToAdjust = await this.postImageRepository.find({
      order: { order_no: 'ASC' },
      where: { post: { uuid: imageToUpdate.post.uuid } }
    });

    // Update the order numbers accordingly
    for (const image of imagesToAdjust) {
      if (image.id === postImageId) {
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

    await this.postImageRepository.save(imagesToAdjust);
  }
}
