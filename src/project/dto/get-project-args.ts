import { IProject } from '../../common/interfaces/project.entity.interface';

export class GetProjectArgs implements Partial<IProject> {
  uuid?: string;
}
