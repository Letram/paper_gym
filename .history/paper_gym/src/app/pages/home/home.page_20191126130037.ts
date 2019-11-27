import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { Exercise } from 'src/app/models/Exercise';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public currentUser: any;
  public userExercises: Exercise[];

  constructor(private _authService:AuthService, private _exerciseService:ExerciseService, private _router: Router) { }

  ngOnInit() {
    console.log("Home page init...");
    this._exerciseService.getExercises().subscribe(
      response => {
        this.userExercises = []
        for(let i = 0; i < response.length; i++){
          let exerciseAux = response[i].payload.doc.data() as Exercise;
          exerciseAux.id = response[i].payload.doc.id 
          this.userExercises.push((response[i].payload.doc.data()) as Exercise)
          console.log({
            exId: response[i].payload.doc.id,
            exData: response[i].payload.doc.data()
          });
        }
        console.log(this.userExercises);
        if(!response)console.log("No exercises available yet...");
      },
      error => {
        console.log(`[HOME PAGE ERR] => ${error}`);
      }
    );
  }

  logout(){
    this._authService.logout().then(
      () => this._router.navigate([""])
    );
  }

  openExercise(exerciseToOpen: Exercise){
    let navigationExtras: NavigationExtras = {
      state: {
        exercise: exerciseToOpen
      }
    };
    this._router.navigate(["exercise"], navigationExtras);
  }
}
