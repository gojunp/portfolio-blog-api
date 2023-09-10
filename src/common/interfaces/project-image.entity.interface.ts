import { IImage } from './image.entity.interface';
import { IProject } from './project.entity.interface';

export interface IProjectImage {
  id: number;
  order_no: number;
  image: IImage;
  project: IProject;
}
