import { Component, OnInit                        } from '@angular/core';
import { SafeResourceUrl, DomSanitizer            } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

// Models
import { Exercise } from 'src/app/models/Exercise';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {

  exercise: Exercise;
  trustedVideoUrl: SafeResourceUrl;
  
  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor(private _route: ActivatedRoute, private _router: Router, private _domSanitizer: DomSanitizer) {
    this.exercise = new Exercise();
  }

  ngOnInit() {

    this._route.queryParams.subscribe(
      (_) => {
        if ( this._router.getCurrentNavigation().extras.state ) {
          this.exercise = this._router.getCurrentNavigation().extras.state.exercise;
        }
      }
    );

    if (this.exercise.video) {
      this.trustedVideoUrl = this._domSanitizer.bypassSecurityTrustResourceUrl( this.transform( this.exercise.video ));
    }
  }

  editExercise(){

    let navigationExtras: NavigationExtras = {
      state: {
        exercise: this.exercise,
        edit: true
      }
    };

    this._router.navigate( ["add"], navigationExtras );
  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  private transform(videoURL: string){
    return videoURL.replace("youtu.be", "youtube.com/embed");
  }
}
