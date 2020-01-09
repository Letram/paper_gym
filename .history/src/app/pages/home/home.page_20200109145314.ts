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

  musclesToday  : string  [] = [];
  exercisesToday: any[] = [];

  exerciseIDAboutToRemove: string;

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
        edit: true
      }
    };

    this.router.navigate( ['add'], navigationExtras );
  }

  showConfirmBox( exerciseID: string ) {

    this.exerciseIDAboutToRemove = exerciseID;

    $('.confirm-overlay').animate({
      zIndex: 200
    }, 0, function() {
      $('.confirm-overlay').css('opacity', '1');
    });

  }

  removeExercise( decision: string ) {

    if ( decision === 'yes' ) {
      this._exerciseService.removeExercise( this.exerciseIDAboutToRemove )
      .then(
        () => {
          this.getExercisesList();
        }
      )
      .catch(
        ( error ) => console.log(`[ REMOVE EXERCISE ERROR ] » ${ error }` )
      );
    }

    this.hideConfirmBox();
  }

  changeDay( day: number ) {

    this.selectedDay = day;

    this.getTodayRoutine( this.selectedDay );

  }

  collapseExercisesList( index: number ) {
    
    if ( $( `#title-${ index } .caret` ).hasClass( 'collapsed' )) {
      $( `#title-${ index } .caret` ).removeClass( 'collapsed' );
    } else {
      $( `#title-${ index } .caret` ).addClass( 'collapsed' );
    }


    $( `#exercises-list-${ index }` ).fadeToggle( 250 );

  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  private today() {

    let today = new Date().getDay() - 1;

    return today === -1 ? 6 : today;

  }

  private hideConfirmBox() {

    this.exerciseIDAboutToRemove = null;

    $('.confirm-overlay').animate({
      opacity: 0
    }, 250, function() {
      $('.confirm-overlay').css('z-index', '-1');
    });

  }

  // ────────────────────────────────── //
  //     TODAY'S ROUTINE GENERATION     //
  // ────────────────────────────────── //

  private getExercisesList() {

    let exercise: Exercise;

    this._exerciseService.getExercises().subscribe(
      response => {

        // Vaciamos el listado de ejercicios para evitar la aparición de duplicados tras eliminar un ejercicio (no cambies esta instrucción de sitio, debe estar dentro de la promesa para surtir efecto)
        this.exercises = [];

        for( let i = 0; i < response.length; i++ ) {

          exercise    = response[i].payload.doc.data();
          exercise.id = response[i].payload.doc.id; 

          this.exercises.push( exercise );

        }
        let exercisesByDays = [];
        for (var i = 0; i <= 7; i++){
          let exercisesOfDay: any = {};
          exercisesOfDay.day = this.days[i];
          exercisesOfDay.exercises = this.getTodayRoutine_2( i );
          exercisesByDays.push(exercisesOfDay);
        }
        console.log({exercisesByDays, exercises: this.exercises});
        
        this.getTodayRoutine( this.selectedDay );
        let aux = this.getTodayRoutine_2( this.selectedDay );

        console.log({
          todayRoutine: this.exercisesToday,
          todayRoutine_2: aux 
        })

        console.log(this.getMusclesFromDay( this.selectedDay ));
        
      }, exception => {

        this.exercises = [];
        console.log(`[ ERROR MESSAGE ] » ${ exception }`);

      }
    );
  }

  private getTodayRoutine_2( today: number = this.today()){
    // Almacenamos los grupos musculares asignados al día seleccionado
    this.musclesToday = this.getMusclesFromDay( today );

    // Almacenamos los ejercicios asignados al día seleccionado
    let todaysExercises = today === 7 ? this.exercises : this.exercises.filter( exercise => exercise.days[today] );
    let exercisesByMuscles = [];

    this.musclesToday.forEach( function(muscleGroup, index){
      exercisesByMuscles[index] = {};
      if(muscleGroup === "all") exercisesByMuscles[index].exercises = todaysExercises.filter(exercise => exercise.muscleGroups.length === 0);
      else exercisesByMuscles[index].exercises = todaysExercises.filter(exercise => exercise.muscleGroups.includes(muscleGroup));
      exercisesByMuscles[index].muscleGroupName = muscleGroup;
    });
    console.log(exercisesByMuscles);
    return exercisesByMuscles;
  }
  private getTodayRoutine( today: number = this.today() ) {

    // Almacenamos los grupos musculares asignados al día seleccionado
    this.musclesToday = this.getMusclesFromSpecificDay( today );

    // Almacenamos los ejercicios asignados al día seleccionado
    let todaysExercises = today === 7 ? this.exercises : this.exercises.filter( exercise => exercise.days[today] );

    // Agrupamos dichos ejercicios por grupos musculares
    for ( let i = 0; i < this.musclesToday.length; i++ ) {
      this.exercisesToday[i] = todaysExercises.filter( exercise => exercise.muscleGroups.find( muscle => muscle === this.musclesToday[i] ));
    }

    // Si uno de los grupos musculares es 'all' (ubicado siempre al final), agrupamos los ejercicios correspondientes
    if ( this.musclesToday.find( muscle => muscle === 'all' )) {
      this.exercisesToday[ this.musclesToday.length - 1 ] = todaysExercises.filter( exercise => exercise.muscleGroups.length === 0 );
    }

    // console.log( 'Grupos musculares:', this.musclesToday );
    // console.log( 'Listado de ejercicios:', this.exercisesToday );

  }

  private getMusclesFromDay( day: number ){

    let todaysExercises = this.getExercisesFromSpecificDay( day );
    let exerciseMuscles = todaysExercises.map(exercise => exercise.muscleGroups);
    let distinctExercises = [... new Set([].concat(... exerciseMuscles))];

    if(todaysExercises.find(exercise => exercise.muscleGroups.length === 0))
    distinctExercises.push("all");
    return distinctExercises;
  }

  private getMusclesFromSpecificDay( day: number ) {

    let todaysMuscles = [];

    // Almacenamos ejercicios correspondientes al día seleccionado
    let todaysExercises = this.getExercisesFromSpecificDay( day );

    // Recorremos estos ejercicios para extraer los grupos musculares asignados
    todaysExercises.forEach( exercise => {

      // Para cada ejercicio, recorremos los grupos musculares asignados
      exercise.muscleGroups.forEach( muscleGroup => {

        // Comprobamos que el grupo muscular no esté repetido
        if ( !todaysMuscles.find( muscle => muscleGroup === muscle )) {
          todaysMuscles.push( muscleGroup );
        }
        
      });
    });

    // Si existen ejercicios sin grupo muscular asignado, se inserta 'all' al final del vector de grupos musculares
    if ( todaysExercises.find( exercise => exercise.muscleGroups.length === 0 )) {
      todaysMuscles.push( 'all' );
    }

    return todaysMuscles;
  }

  private getExercisesFromSpecificDay( day: number ) {
    return day === 7 ? this.exercises : this.exercises.filter( exercise => exercise.days[ day ] );
  }

  private generateSchedule() {

    // Almacenamos en un vector los grupos musculares asignados para cada día
    for ( let i = 0; i < 7; i++ ) {
      this.musclesPerDay[i] = this.getMusclesFromSpecificDay( i );
    }

    // Para cada día de la semana asignamos los correspondientes grupos musculares con sus correspondientes ejercicios
    for ( let i = 0; i < 7; i++ ) {

      let day     = this.days[i].toLowerCase();
      let muscles = this.musclesPerDay[i];

      muscles.forEach( ( muscle: string ) => {
        this.schedule[ day ][ muscle ] = this.getExercisesFromSpecificDay(i).filter( exercise => exercise.muscleGroups.find( muscleGroup => muscle == muscleGroup ));
      });
    }
  }
}