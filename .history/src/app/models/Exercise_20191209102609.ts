import { MuscleGroup } from "./MuscleGroup";
export class Exercise {
  name: string;
  description: string;
  machine: string;
  images: any[];
  muscleGroups: string[];
  video: string;
  days: boolean[];

  constructor() {
    this.name = "";
    this.description = "";
    this.machine = "";
    this.images = [];
    this.muscleGroups = [];
    this.video = "";
    this.days = [false, false, false, false, false, false, false];
  }
}
