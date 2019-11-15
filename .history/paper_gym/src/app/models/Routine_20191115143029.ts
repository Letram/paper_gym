import { Exercise } from "./Exercise";
import { MuscularGroup } from "./MuscularGroup";
export class Routine {
  private _id: string;
  private _exercises: Exercise[];
  private _muscularGroups: MuscularGroup[];

  constructor(
    id: string,
    exercises: Exercise[],
    muscularGroups: MuscularGroup[]
  ) {
    this._id = id;
    this._exercises = exercises;
    this._muscularGroups = muscularGroups;
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
  public get muscularGroups(): MuscularGroup[] {
    return this._muscularGroups;
  }
  public set muscularGroups(value: MuscularGroup[]) {
    this._muscularGroups = value;
  }
}
