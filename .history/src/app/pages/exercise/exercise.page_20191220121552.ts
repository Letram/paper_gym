import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Exercise } from 'src/app/models/Exercise';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {

  exercise: Exercise;
  trustedVideoUrl: SafeResourceUrl;
  sliderOptions: any = {
    initialSlide: 1,
    speed: 400
  };
  constructor(
    private _route: ActivatedRoute, 
    private _router: Router,
    private _domSanitizer: DomSanitizer,
    private _exerciseService: ExerciseService) {
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
    if(this.exercise.video){
      this.trustedVideoUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.transform(this.exercise.video));
    }
  }

  private transform(videoURL: string){
    return videoURL.replace("youtu.be", "youtube.com/embed");
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

  updateSeries(amount:number):void{
    this.exercise.series = (this.exercise.series += amount) <= 1 ? 1 : (this.exercise.series += amount);
    this._exerciseService.updateExercise(this.exercise, this.exercise.id)
  }

  updateReps(amount:number):void{
    this.exercise.reps = (this.exercise.reps += amount) <= 1 ? 1 : (this.exercise.reps += amount);
    this._exerciseService.updateExercise(this.exercise, this.exercise.id)
  }

  updaterestTime(amount:number):void{
    this.exercise.restTime = (this.exercise.restTime += amount) <= 0 ? 0 : (this.exercise.restTime += amount);
    this._exerciseService.updateExercise(this.exercise, this.exercise.id)
  }
}
