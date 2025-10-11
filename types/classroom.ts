import { Content } from "./contents";

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  folders: {
    normal: Content[];
    visual: Content[];
    hearing: Content[];
    cognitive: Content[];
    motor: Content[];
  };
}