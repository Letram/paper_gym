import { MuscleGroup } from "./MuscleGroup";
export class Exercise {
  name: string;
  description: string;
  machine: string;
  images: any[];
  muscleGroups: string[];
  video: string;

  constructor() {
    this.name = "";
    this.description = "";
    this.machine = "";
    this.images = [];
    this.muscleGroups = [];
    this.video = "";
  }
}
