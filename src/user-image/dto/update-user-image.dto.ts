import { PartialType } from '@nestjs/swagger';
import { CreateUserImageDto } from './create-user-image.dto';

export class UpdateUserImageDto extends PartialType(CreateUserImageDto) {}
