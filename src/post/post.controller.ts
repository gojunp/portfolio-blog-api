import { IsOptional } from 'class-validator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { PostService } from './services/post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/entities';
import { CurrentUser } from '../common/middleware/current.user';
import { AuthGuard } from '../common/guards';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { Post as PostEntity } from './entities';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { GetPostArgs, GetPostsArgs } from './dto';
import { Order } from '../common/constants';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description: 'Post has been successfully created',
    type: PostEntity
  })
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    type: [PostEntity]
  })
  findAll() {
    return this.postService.findAll();
  }

  @Get('/paginate')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(PostEntity)
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiOperation({ summary: 'Paginate Posts' })
  async paginatePosts(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() getPostsArgs: GetPostsArgs,
    @Query('sortBy') sortBy?: string,
    @Query('orderBy') orderBy?: Order
  ): Promise<PageDto<PostEntity>> {
    if (sortBy) {
      sortBy = encodeURIComponent(sortBy);
    }

    return this.postService.listEntities(
      pageOptionsDto,
      sortBy,
      orderBy,
      getPostsArgs
    );
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a post by UUID' })
  @ApiResponse({
    status: 200,
    description: 'Found an entry',
    type: PostEntity
  })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  findOne(@Param('uuid') uuid: string) {
    return this.postService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a post by UUID' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: PostEntity
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('uuid') uuid: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(uuid, updatePostDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a post by UUID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted'
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('uuid') uuid: string) {
    return this.postService.remove(uuid);
  }
}
