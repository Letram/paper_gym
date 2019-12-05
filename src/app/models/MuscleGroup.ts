export class MuscleGroup {
  private _id: string;
  private _name: string;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get id() {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }
}
