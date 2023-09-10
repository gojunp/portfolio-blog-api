import { IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class GetProjectsArgs {
  @IsNumberString()
  @IsOptional()
  userId: number;

  @IsUUID()
  @IsOptional()
  uuid: string;
}
