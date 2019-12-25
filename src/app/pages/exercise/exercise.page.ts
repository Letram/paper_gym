import { Component, OnInit } from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

// Models
import { Exercise        } from "src/app/models/Exercise";
import { ExerciseService } from "src/app/services/exercise.service";

// jQuery
declare var $: any;

@Component({
  selector: "app-exercise",
  templateUrl: "./exercise.page.html",
  styleUrls: ["./exercise.page.scss"]
})
export class ExercisePage implements OnInit {

  exercise: Exercise;

  trustedVideoUrl: SafeResourceUrl;

  sliderOptions: any = {
    initialSlide: 1,
    speed: 400
  };

  constructor( private _router: Router, private _route: ActivatedRoute, private _domSanitizer: DomSanitizer, private _exerciseService: ExerciseService ) {}

  ngOnInit() {

    this.exercise = new Exercise();

    this._route.queryParams.subscribe(_ => {
      if (this._router.getCurrentNavigation().extras.state) {
        this.exercise = Object.assign(
          this.exercise,
          this._router.getCurrentNavigation().extras.state.exercise
        );
        console.log(this.exercise);
        if (this.exercise.video) {
          this.trustedVideoUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(
            this.transform(this.exercise.video)
          );
        }
      } else {
        this._router.navigate(["home"]);
      }
    });
  }

  editExercise() {

    let navigationExtras: NavigationExtras = {
      state: {
        exercise: this.exercise,
        edit: true
      }
    };

    this._router.navigate(["add"], navigationExtras);

  }

  updateParam( param: string, amount: number ): void {
    this.exercise[param] = this.exercise[param] + amount <= 1 ? 1 : this.exercise[param] + amount;
    this._exerciseService.updateExercise(this.exercise, this.exercise.id);
  }

  // ────────────────── //
  //     MULTIMEDIA     //
  // ────────────────── //
  
  zoomImage( imageURL: string ) {

    $( '.zoomed-image .image' ).attr( 'src', imageURL );

    $('.zoomed-image').animate({
      zIndex: 200
    }, 0, function() {
      $( '.zoomed-image' ).css( 'opacity', '1');
    });
    
  }

  closeZoomedImage() {
   
    $('.zoomed-image').animate({
      opacity: 0
    }, 0, function() {
      $( '.zoomed-image' ).css( 'z-index', '-1');
    });

  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  private transform( videoURL: string ) {
    return videoURL.replace("youtu.be", "youtube.com/embed");
  }
}
