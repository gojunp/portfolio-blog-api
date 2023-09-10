import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFiles
} from '@nestjs/common';
import { PostImageService } from './services/post-image.service';
import { CreatePostImageDto } from './dto/create-post-image.dto';
import { UpdatePostImageDto } from './dto/update-post-image.dto';
import { AuthGuard } from '../common/guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostImage } from './entities/post-image.entity';

@ApiTags('Post Image')
@Controller('post-image')
export class PostImageController {
  constructor(private readonly postImageService: PostImageService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create project images' })
  @ApiResponse({
    status: 201,
    description: 'Post images have been successfully created'
  })
  @UseInterceptors(
    FilesInterceptor('images', null, {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only .jpg, .jpeg and .png formats are allowed'),
            false
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 19922944 }
    })
  )
  create(
    @Body() createPostImageDto: CreatePostImageDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.postImageService.create(createPostImageDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all post images' })
  @ApiResponse({
    status: 200,
    description: 'List of post images',
    type: [PostImage]
  })
  @UseGuards(AuthGuard)
  findAll() {
    return this.postImageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Found an entry',
    type: PostImage
  })
  findOne(@Param('id') id: string) {
    return this.postImageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a post image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: PostImage
  })
  update(@Param('id') id: string, @Body() updateImageDto: UpdatePostImageDto) {
    return this.postImageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a post image by ID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted'
  })
  remove(@Param('id') id: string) {
    return this.postImageService.remove(+id);
  }
}
