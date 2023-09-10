import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from '../common/middleware/current.user';
import { User } from '../user/entities';
import { AuthGuard } from '../common/guards';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { Project } from './entities/project.entity';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { Order } from '../common/constants';
import { GetProjectsArgs } from './dto/get-projects-args';
import { GetProjectArgs } from './dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({
    status: 201,
    description: 'Project has been successfully created',
    type: Project
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User
  ) {
    return this.projectService.create(createProjectDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'List of projects',
    type: [Project]
  })
  findAll(@Query() projectsArgs: GetProjectsArgs) {
    return this.projectService.findAll(projectsArgs);
  }

  @Get('/paginate')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(Project)
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiOperation({ summary: 'Paginate Projects' })
  async getProjects(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('sortBy') sortBy: string,
    @Query('orderBy') orderBy: Order,
    @Query() getProjectsArgs: GetProjectsArgs
  ): Promise<PageDto<Project>> {
    if (sortBy) {
      sortBy = encodeURIComponent(sortBy);
    }

    return this.projectService.listEntities(
      pageOptionsDto,
      sortBy,
      orderBy,
      getProjectsArgs
    );
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project by UUID' })
  @ApiResponse({
    status: 200,
    description: 'Found an entry',
    type: Project
  })
  findOne(@Param('uuid') uuid: string) {
    return this.projectService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a project by UUID' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: Project
  })
  update(
    @Param('uuid') uuid: string,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectService.update(uuid, updateProjectDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a project by UUID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted'
  })
  remove(@Param('uuid') uuid: string) {
    return this.projectService.remove(uuid);
  }
}
