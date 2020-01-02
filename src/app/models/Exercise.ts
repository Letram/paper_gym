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
  series  : number;
  reps    : number;
  restTime: number;
  weight  : number;
  
  constructor() {
    this.id           = '';
    this.name         = '';
    this.description  = '';
    this.machine      = '';
    this.muscleGroups = [];
    this.days         = [ false, false, false, false, false, false, false ];
    this.images       = [];
    this.video        = '';
    // this.series   = 0;
    // this.reps     = 0;
    // this.weight   = 0;
    // this.restTime = 0;
  }
}
