import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
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
    this.currentUser = this._authService.isLogged;
    console.log(this.currentUser);
    this._exerciseService.getExercises(this.currentUser.uid).subscribe(
      response => {

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
}
