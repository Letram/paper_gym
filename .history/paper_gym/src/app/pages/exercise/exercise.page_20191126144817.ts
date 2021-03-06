import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Exercise } from 'src/app/models/Exercise';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {

  exercise: Exercise;
  sliderOptions: any = {
    initialSlide: 1,
    speed: 400
  };
  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.exercise = new Exercise();
  }

  ngOnInit() {
    console.log("Exercise details page init...");
    this._route.queryParams.subscribe(
      (_) => {
        if(this._router.getCurrentNavigation().extras.state){
          this.exercise = this._router.getCurrentNavigation().extras.state.exercise;
          console.log(this.exercise);
        }
      }
    );
  }

  editExercise(){
    let navigationExtras: NavigationExtras = {
      state: {
        exercise: this.exercise,
        edit: true
      }
    };

    this._router.navigate(["add"], navigationExtras);
  }

}
