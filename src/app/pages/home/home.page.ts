import { Component, OnInit        } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

// Models
import { Exercise } from 'src/app/models/Exercise';

// Services
import { ExerciseService } from 'src/app/services/exercise.service';

// jQuery
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public exercises: Exercise[] = [];

  configuracion = {
    loop: false,
    spaceBetween: 0,
    slidesPerView: 'auto',
    autoHeight: true,
    pagination: false,
    navigation: false
  };

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private _exerciseService: ExerciseService, private router: Router ) {}

  ngOnInit() {
    
    this._exerciseService.getExercises().subscribe(
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

  showOptions( index: number ) {

    let id = `#card${ index }`;

    if ( $( id ).hasClass('active') ) {
      $( id ).removeClass( 'active' );
    }
    else {
      $( id ).addClass( 'active' );
    }

  }

  openExercise( exerciseToOpen: Exercise ) {

    let navigationExtras: NavigationExtras = {
      state: {
        exercise: exerciseToOpen
      }
    };

    this.router.navigate( ['exercise'], navigationExtras );
  }

  removeExercise(exerciseId:string){
    this._exerciseService.removeExercise(exerciseId)
    .then(
      () => console.log("Exercise removed successfully")
    )
    .catch(
      (error) => console.log(`[REMOVE EXERCISE ERR] => ${error}`)
    );
  }

  editExercise( exerciseToEdit: Exercise){
    let navigationExtras: NavigationExtras = {
      state: {
        exercise: exerciseToEdit,
        edit:true
      }
    };

    this.router.navigate( ['add'], navigationExtras );
  }
}
