import { Component, OnInit        } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

// Models
import { Exercise } from 'src/app/models/Exercise';

// Services
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public exercises: Exercise[] = [];

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private exerciseService: ExerciseService, private router: Router ) {}

  ngOnInit() {
    
    this.exerciseService.getExercises().subscribe(
      response => {
        this.exercises = [];
        for( let i = 0; i < response.length; i++ ) {
          let exerciseAux = response[i].payload.doc.data();
          exerciseAux.id = response[i].payload.doc.id; 
          console.log({exerciseAux, id: response[i].payload.doc.id});
          this.exercises.push(exerciseAux);
        }

        console.log( this.exercises );

      }, exception => {
        console.log(`[ ERROR MESSAGE] » ${ exception }`);
      }
    );

  }

  openExercise( exerciseToOpen: Exercise ) {
    console.log("Press works!");
    return;
    let navigationExtras: NavigationExtras = {
      state: {
        exercise: exerciseToOpen
      }
    };

    this.router.navigate( ['exercise'], navigationExtras );
  }

  onLongPress(){
    console.log("Long press works!");
  }
}
