import { MuscleGroup } from "./MuscleGroup";
export class Exercise {
  private _name: string;
  private _description: string;
  private _machine: string;
  private _images: any[];
  private _muscleGroups: string[];
  private _video: string;

  constructor() {
    this.name = "";
    this.description = "";
    this.machine = "";
    this.images = [];
    this.muscleGroups = [];
    this.video = "";
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get video(): string {
    return this._video;
  }
  public set video(value: string) {
    this._video = value;
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
  public get images(): any[] {
    return this._images;
  }
  public set images(value: any[]) {
    this._images = value;
  }
  public get muscleGroups(): string[] {
    return this._muscleGroups;
  }
  public set muscleGroups(value: string[]) {
    this._muscleGroups = value;
  }
}
