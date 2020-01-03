export class Exercise {

  // Information
  id     : string;
  name   : string;
  machine: string;
  description : string;
  muscleGroups: string[];

  days: boolean[];

  // Multimedia
  images: any[];
  video: string;

  // Parameters
  series  : string;
  reps    : string;
  restTime: string;
  weight  : string;
  
  constructor() {
    this.id           = '';
    this.name         = '';
    this.description  = '';
    this.machine      = '';
    this.muscleGroups = [];
    this.days         = [ false, false, false, false, false, false, false ];
    this.images       = [];
    this.video        = '';
    this.series       = '';
    this.reps         = '';
    this.weight       = '';
    this.restTime     = '';
  }
}
