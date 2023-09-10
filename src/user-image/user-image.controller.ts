import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { UserImageService } from './services/user-image.service';
import { AuthGuard } from '../common/guards';
import { CurrentUser } from '../common/middleware/current.user';
import { User } from '../user/entities';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserImage } from './entities/user-image.entity';

@ApiTags('User Image')
@Controller('user-image')
@UseGuards(AuthGuard)
export class UserImageController {
  constructor(private readonly userImageService: UserImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user image' })
  @ApiResponse({
    status: 201,
    description: 'User image has been successfully created',
    type: UserImage
  })
  @ApiResponse({
    status: 409,
    description:
      'You already have a profile image. Remove the existing one first.'
  })
  @UseInterceptors(FileInterceptor('image'))
  create(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.userImageService.create(user, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user images' })
  @ApiResponse({
    status: 200,
    description: 'List of user images',
    type: [UserImage]
  })
  findAll() {
    return this.userImageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Found an entry',
    type: UserImage
  })
  findOne(@Param('id') id: string) {
    return this.userImageService.findOne(+id);
  }

  /*  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdatePostImageDto) {
    console.log(updateImageDto);
    return this.postImageService.update(+id, updateImageDto);
  } */

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user image by ID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted'
  })
  remove(@Param('id') id: string) {
    return this.userImageService.remove(+id);
  }
}
