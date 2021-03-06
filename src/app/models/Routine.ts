import { Exercise } from "./Exercise";
import { MuscleGroup } from "./MuscleGroup";
export class Routine {
  private _id: string;
  private _exercises: Exercise[];
  private _muscleGroups: string[];

  constructor(id: string, exercises: Exercise[], muscleGroups: string[]) {
    this._id = id;
    this._exercises = exercises;
    this._muscleGroups = muscleGroups;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get exercises(): Exercise[] {
    return this._exercises;
  }
  public set exercises(value: Exercise[]) {
    this._exercises = value;
  }
  public get muscleGroups(): string[] {
    return this._muscleGroups;
  }
  public set muscleGroups(value: string[]) {
    this._muscleGroups = value;
  }
}
