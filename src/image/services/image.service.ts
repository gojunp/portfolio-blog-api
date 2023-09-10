import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>
  ) {}

  /*   async create(
    createImageDto: CreateImageDto,
    file: Express.Multer.File
  ): Promise<Image> {
    let user: User;
    let post: Post;
    if (createImageDto.postUuid && createImageDto.userId) {
      throw new ConflictException(
        'Cannot provide both user and post for an image.'
      );
    }

    if (createImageDto.userId) {
      user = await this.userRepository.findOne({
        where: { id: createImageDto.userId }
      });
      console.log(user);
      if (!user) throw new NotFoundException('User not found!');
    }
    if (createImageDto.postUuid) {
      post = await this.postRepository.findOne({
        where: { uuid: createImageDto.postUuid }
      });
      if (!post) throw new NotFoundException('Post not found!');
    }

    delete createImageDto?.postUuid;
    delete createImageDto?.userId;
    if (user) {
      // If profile image already exists, delete that one first
      if (user.image) {
        const imageUrl = user.image.url.split('.net/')[1];
        await this.deleteFromStorage(imageUrl);

        try {
          console.log(user.image.id);
          await this.imageRepository.delete({ id: user.image.id });
        } catch (error) {
          console.log(error);
          throw new Error('Old profile image deletion failed');
        }
      }

      const url = await this.uploadToStorage(
        `profile-image/${file.originalname}`,
        file
      );
      const image = this.imageRepository.create({
        ...createImageDto,
        user: user,
        url: url
      });

      return await this.imageRepository.save(image);
    }
    if (post) {
      const lastImage = await this.imageRepository.findOne({
        where: { post: { uuid: post.uuid } },
        order: { order_no: 'DESC' } // Get the last image by order number
      });

      const url = await this.uploadToStorage(
        `post-image/${file.originalname}`,
        file
      );

      const image = this.imageRepository.create({
        ...createImageDto,
        post: post,
        url: url,
        order_no: lastImage ? lastImage.order_no + 1 : 1
      });
      return await this.imageRepository.save(image);
    }
  }
 */
  async findAll(): Promise<Image[]> {
    const result = await this.imageRepository.find();
    if (!result) throw new NotFoundException('Images Not Found.');
    return result;
  }

  async findOne(id: number): Promise<Image> {
    const result = await this.imageRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('User Not Found.');
    return result;
  }

  /*   async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const result = await this.imageRepository.findOne({
      where: { id: id }
    });
    if (!result) throw new NotFoundException('User Not Found.');

    Object.assign(result, updateImageDto);

    return await this.imageRepository.save(result);
  } */

  /* async remove(id: number): Promise<Image> {
    try {
      const result = await this.imageRepository.findOne({
        where: { id: id }
      });
      await this.imageRepository.delete(id);
      return result;
    } catch (error) {
      this.logger.error('Image deletion failed', error);
      throw new Error('Image deletion failed!');
    }
  } */
}
