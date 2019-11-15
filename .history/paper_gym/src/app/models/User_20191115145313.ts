import { Routine } from "./Routine";
import { Exercise } from "./Exercise";
export class User {
  private _routines: Routine[];
  private _favExercises: Exercise[];

  constructor(routines: Routine[], favExercises: Exercise[]) {
    this._routines = routines;
    this._favExercises = favExercises;
  }

  public get routines(): Routine[] {
    return this._routines;
  }
  public set routines(value: Routine[]) {
    this._routines = value;
  }
  public get favExercises_1(): Exercise[] {
    return this._favExercises;
  }
  public set favExercises_1(value: Exercise[]) {
    this._favExercises = value;
  }
}
