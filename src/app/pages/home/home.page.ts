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

  private exercises: Exercise[] = [];

  configuracion = {
    freeMode: true,
    autoHeight: true,
    spaceBetween: 0,
    slidesPerView: 'auto'
  };

  days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'All' ];

  schedule = { 'monday': {},'tuesday': {},'wednesday': {},'thursday': {},'friday': {},'saturday': {},'sunday': {},'all': {} };

  musclesGroups = [];
  
  musclesPerDay = new Array(7);

  selectedDay: number = 0;

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private _exerciseService: ExerciseService, private router: Router ) {}

  ngOnInit() {

    this.selectedDay = this.today();

    this.getExercisesList();

  }

  showOptions( muscleName: string, exerciseIndex: number ) {

    const id = `#card${ muscleName }${ exerciseIndex }`;

    if ( $( id ).hasClass('active') ) {
      $( id ).removeClass( 'active' );
    } else {
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

  editExercise( exerciseToEdit: Exercise){
    let navigationExtras: NavigationExtras = {
      state: {
        exercise: exerciseToEdit,
        edit:true
      }
    };

    this.router.navigate( ['add'], navigationExtras );
  }

  removeExercise( exerciseID: string ) {
    this._exerciseService.removeExercise( exerciseID )
    .then(
      () => console.log("Exercise removed successfully")
    )
    .catch(
      (error) => console.log(`[REMOVE EXERCISE ERR] => ${error}`)
    );
  }

  changeDay( day: number ) {

    this.selectedDay = day;

    this.getTodayRoutine( this.selectedDay );

  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  private today() {

    let today = new Date().getDay() -1;

    return today === -1 ? 6 : today;

  }

  private getExercisesList() {

    let exercise: Exercise;

    this._exerciseService.getExercises().subscribe(
      response => {

        for( let i = 0; i < response.length; i++ ) {

          exercise    = response[i].payload.doc.data();
          exercise.id = response[i].payload.doc.id; 

          this.exercises.push( exercise );

        }

        this.generateSchedule();
        this.getTodayRoutine( this.selectedDay );

      }, exception => {

        this.exercises = [];
        console.log(`[ ERROR MESSAGE] » ${ exception }`);

      }
    );
  }

  private generateSchedule() {

    // Almacenamos en un vector los grupos musculares asignados para cada día
    for ( let i = 0; i < 7; i++ ) {
      this.musclesPerDay[i] = this.getMusclesFromSpecificDay( i );
    }

    // console.log( this.musclesPerDay )

    // Para cada día de la semana asignamos los correspondientes grupos musculares con sus correspondientes ejercicios
    for ( let i = 0; i < 7; i++ ) {

      let day     = this.days[i].toLowerCase();
      let muscles = this.musclesPerDay[i];

      muscles.forEach( ( muscle: string ) => {
        this.schedule[ day ][ muscle ] = this.getExercisesFromSpecificDay(i).filter( exercise => exercise.muscleGroups.find( muscleGroup => muscle == muscleGroup ));
      });
    }
  }

  private getExercisesFromSpecificDay( day: number ) {
    
    return day === 7 ? this.exercises : this.exercises.filter( exercise => exercise.days[ day ] == true );

  }

  private getMusclesFromSpecificDay( day: number ) {

    let muscles = [];

    this.getExercisesFromSpecificDay( day ).forEach( exercise => {
      exercise.muscleGroups.forEach( muscle => {
        muscles.push( muscle );
      });
    });

    muscles =  [...new Set( muscles )]; // Eliminamos los elementos repetidos

    return muscles;
  }

  musclesToday  : string  [] = [];
  exercisesToday: any[] = [];

  private getTodayRoutine( today: number = this.today() ) {
    
    // Almacenamos los grupos musculares asignados al día seleccionado
    this.musclesToday = this.getMusclesFromSpecificDay( today );
    
    console.log( `────────────────────────────────────────────────────` );
    console.log( this.musclesToday );
    console.log( `────────────────────────────────────────────────────` );

    // Almacenamos los ejercicios correspondientes al día seleccionado, clasificados por grupos musculares
    this.exercisesToday = [];
    for ( let i = 0; i < this.musclesToday.length; i++ ) {
      this.exercisesToday[i] = this.exercises.filter( exercise => exercise.days[today] && exercise.muscleGroups.find( muscle => muscle === this.musclesToday[i] ) );
    }

    console.log( `────────────────────────────────────────────────────` );
    console.log( this.exercisesToday );
    console.log( `────────────────────────────────────────────────────` );

  }
}