import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UploadedFiles
} from '@nestjs/common';
import { ProjectImageService } from './services/project-image.service';
import { CreateProjectImageDto } from './dto/create-project-image.dto';
import { UpdateProjectImageDto } from './dto/update-project-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectImage } from './entities/project-image.entity';

@ApiTags('Project Image')
@Controller('project-image')
export class ProjectImageController {
  constructor(private readonly projectImageService: ProjectImageService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a project image' })
  @ApiResponse({
    status: 201,
    description: 'Project image has been successfully created',
    type: ProjectImage
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
    @Body() createProjectImageDto: CreateProjectImageDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.projectImageService.create(createProjectImageDto, files);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all project images' })
  @ApiResponse({
    status: 200,
    description: 'List of project images',
    type: [ProjectImage]
  })
  findAll() {
    return this.projectImageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Found an entry',
    type: ProjectImage
  })
  findOne(@Param('id') id: string) {
    return this.projectImageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a project image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: ProjectImage
  })
  update(
    @Param('id') id: string,
    @Body() updateProjectImageDto: UpdateProjectImageDto
  ) {
    return this.projectImageService.update(+id, updateProjectImageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a project image by ID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted'
  })
  remove(@Param('id') id: string) {
    return this.projectImageService.remove(+id);
  }
}
