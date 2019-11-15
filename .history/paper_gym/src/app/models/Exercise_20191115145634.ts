import { MuscleGroup } from "./MuscleGroup";
export class Exercise {
  private _id: string;
  private _name: string;
  private _description: string;
  private _machine: string;
  private _images: string[];
  private _muscleGroups: MuscleGroup[];

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
  public get machine(): string {
    return this._machine;
  }
  public set machine(value: string) {
    this._machine = value;
  }
  public get images(): string[] {
    return this._images;
  }
  public set images(value: string[]) {
    this._images = value;
  }
  public get muscleGroups(): MuscleGroup[] {
    return this._muscleGroups;
  }
  public set muscleGroups(value: MuscleGroup[]) {
    this._muscleGroups = value;
  }
}
