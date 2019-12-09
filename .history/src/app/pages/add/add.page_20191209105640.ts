import {
  Component,
  OnInit,
  ɵclearResolutionOfComponentResourcesQueue
} from "@angular/core";
import { ExerciseService } from "src/app/services/exercise.service";
import { Exercise } from "src/app/models/Exercise";
import { NgForm } from "@angular/forms";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Router, ActivatedRoute } from "@angular/router";
import { NavController     } from '@ionic/angular';
import {
  TypeModifier,
  THIS_EXPR
} from "@angular/compiler/src/output/output_ast";
import { ImageServiceService } from "src/app/services/image-service.service";
@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  public muscleGroup: string;
  public userMuscleGroups: string[];
  public newExercise: Exercise;
  public imagesPicked: string[];
  public dayNames: string[]; 

  private _isEdited: boolean = false;
  private _editingId: string = "";
  private _userExercises: Exercise[];
  private _imagePicked: File;
  private _imagesPicked: any[];
  private _imagePickerOptions: any;
  constructor(
    private _exerciseService: ExerciseService,
    private _imageService: ImageServiceService,
    private _imagePicker: ImagePicker,
    private _router: Router,
    private _route: ActivatedRoute,
    private navController: NavController
  ) {
    this.newExercise = new Exercise();
    this.muscleGroup = "";
    this.dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  }

  ngOnInit() {
    console.log("Add exercise page init...");
    this.newExercise = new Exercise();
    console.log(this.newExercise);
    console.log({arr: this.newExercise.days, length: this.newExercise.days.length});
    this.muscleGroup = "";
    this._exerciseService.getMuscleGroups().subscribe(
      userMuscleGroupsObject => {
        if (userMuscleGroupsObject.MUSCLEGROUPS)
          this.userMuscleGroups = userMuscleGroupsObject.MUSCLEGROUPS;
        console.log(this.userMuscleGroups);
      },
      error =>
        console.log(`[ADD PAGE ERR {RETRIEVING USER MUSCLEGROUPS}] => ${error}`)
    );
    this._route.queryParams.subscribe(_ => {
      if (
        this._router.getCurrentNavigation().extras.state &&
        this._router.getCurrentNavigation().extras.state.edit
      ) {
        let navigationExercise = this._router.getCurrentNavigation().extras
          .state.exercise;

        this._isEdited = this._router.getCurrentNavigation().extras.state.edit;
        this._editingId = navigationExercise.id;

        this.newExercise = navigationExercise;
        if(this.newExercise.days === undefined){
          this.newExercise.days = [false, false, false, false, false, false, false];
        }
        this.muscleGroup = "";
        this.imagesPicked = this.newExercise.images;
      }
    });
    this._exerciseService.getExercises().subscribe(
      response => {
        this._userExercises = [];
        for (let i = 0; i < response.length; i++) {
          let exerciseAux = response[i].payload.doc.data();
          exerciseAux.id = response[i].payload.doc.id;
          console.log({ exerciseAux, id: response[i].payload.doc.id });
          this._userExercises.push(exerciseAux);
        }
        console.log(this._userExercises);
        if (!response) console.log("No exercises available yet...");
      },
      error => {
        console.log(`[ADD PAGE ERR] => ${error}`);
      }
    );
  }

  return() {
    this.navController.back();
  }

  addMuscleGroup() {
    this.newExercise.muscleGroups.push(this.muscleGroup);
    if (this.userMuscleGroups.indexOf(this.muscleGroup) === -1) {
      this.userMuscleGroups.push(this.muscleGroup);
      this._exerciseService.updateMuscleGroup(this.userMuscleGroups);
    }
    this.muscleGroup = "";
  }

  removeMuscleGroup(muscleGroupToRemove: string): void {
    this.newExercise.muscleGroups.splice(
      this.newExercise.muscleGroups.findIndex(
        exerciseMuscleGroup => exerciseMuscleGroup == muscleGroupToRemove
      ),
      1
    );
    if (
      this._userExercises.filter(userExercise => userExercise.muscleGroups.indexOf(muscleGroupToRemove) !== -1).length <= 1
    ){
      this.userMuscleGroups.splice(this.userMuscleGroups.indexOf(muscleGroupToRemove),1);
      this._exerciseService.updateMuscleGroup(this.userMuscleGroups);
    }else{
      console.log(this._userExercises.filter(userExercise => userExercise.muscleGroups.indexOf(muscleGroupToRemove) !== -1)
      )
    }
  }

  //https://stackoverflow.com/questions/55853879/convert-image-uri-to-file-or-blob/55858622#55858622

  /**
   * To upload images:
   *  1.- Get the base64 encoded img from ImagePicker
   *  2.- Convert the base64 img into Blob file and give it a name.
   *
   *  3a.- Save those objects of {name, blob} in an array of data to be uploaded to Firebase Storage as it accepts blob files.
   *  OR
   *  3b.- Upload each image to Firebase once they are selected. We will have to wait for the data {img_url, img_id}
   */
  pickImages() {
    this.imagesPicked = [];
    this._imagesPicked = [];
    this._imagePickerOptions = {
      //only works on android => maximum pictures to be picked
      maximumImagesCount: 4,
      // quality of resized image, defaults to 100
      quality: 75,
      // output type, defaults to FILE_URIs.
      // available options are
      // window.imagePicker.OutputType.FILE_URI (0) or
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    this.imagesPicked = [];

    // Step 1.
    this._imagePicker.getPictures(this._imagePickerOptions).then(
      results => {
        for (let i = 0; i < results.length; i++) {
          //this.imagesPicked.push(`data:image/jpeg;base64,${results[i]}`);

          // Step 2.
          let blob: Blob = this.getBlob(results[i], ".jpg");
          // Step 3a.
          //this._imagesPicked.push({name: `image${i}.jpg`, blob})
          //Step 3b
          this._imageService.uploadImage(blob).then(response => {
            //response is an object with a download_url and an image_id attributes
            console.log(response);

            this.newExercise.images.push({
              url: response.download_url,
              id: response.image_id
            });
          });
        }
        console.log(this._imagesPicked);
      },
      error => console.log(error)
    );
  }

  private getBlob(
    b64Data: string,
    contentType: string,
    sliceSize: number = 512
  ): Blob {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  removeImage(imageIndex) {
    let imageId = this.newExercise.images[imageIndex].id;
    this._imageService.removeImage(imageId).then(() => {
      this.newExercise.images.splice(imageIndex, 1);
    });
  }

  onAddExercise(form: NgForm) {
    if (!this._isEdited) {
      //creation of the exercise
      this._exerciseService
        .createExercise(this.newExercise, this._imagesPicked)
        .then(() => {
          this.muscleGroup = "";
          this.newExercise = new Exercise();
          this._router.navigate(["home"]);
        });
    } else {
      //update existing exercise
      this._exerciseService
        .updateExercise(this.newExercise, this._editingId)
        .then(() => {
          this._router.navigate(["home"]);
        });
    }
  }

  imagePicked(event) {
    this._imagePicked = event.target.files[0];
  }
}
