import { MuscleGroup } from "./MuscleGroup";
export class Exercise {
  name: string;
  description: string;
  machine: string;
  images: any[];
  muscleGroups: string[];
  video: string;
  days: boolean[];
  series: number;
  reps: number;
  restTime: number;
  id:string;
  constructor() {
    this.id="";
    this.name = "";
    this.description = "";
    this.machine = "";
    this.images = [];
    this.muscleGroups = [];
    this.video = "";
    this.days = [false, false, false, false, false, false, false];
    this.series = 0;
    this.reps = 0;
    this.restTime = 0;
  }
}
