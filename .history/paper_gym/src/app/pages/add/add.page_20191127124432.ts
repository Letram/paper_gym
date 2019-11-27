import { Component, OnInit } from "@angular/core";
import { ExerciseService } from "src/app/services/exercise.service";
import { Exercise } from "src/app/models/Exercise";
import { NgForm } from "@angular/forms";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  public muscleGroup: string;
  public newExercise: Exercise;
  public imagesPicked: string[];

  private _imagePicked: File;
  private _imagesPicked: any[];
  private _imagePickerOptions: any;
  constructor(
    private _exerciseService: ExerciseService,
    private _imagePicker: ImagePicker,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.newExercise = new Exercise();
    this.muscleGroup = "";
  }

  ngOnInit() {
    console.log("Add exercise page init...");
    this.newExercise = new Exercise();
    this.muscleGroup = "";

    this._route.queryParams.subscribe(
      (_) => {
        if(this._router.getCurrentNavigation().extras.state && this._router.getCurrentNavigation().extras.state.edit){
          let navigationExercise = this._router.getCurrentNavigation().extras.state.exercise;
          this.muscleGroup = ""
          this.newExercise = new Exercise();

          this.newExercise.name = navigationExercise._name;
          this.newExercise.description = navigationExercise._description;
          this.newExercise.machine = navigationExercise._machine;
          this.newExercise.muscleGroups = navigationExercise._muscleGroups;
          this.newExercise.images = navigationExercise._images;
          console.log(navigationExercise);
          console.log(this.newExercise);
        } 
      }
    );

  }

  addMuscleGroup() {
    this.newExercise.muscleGroups.push(this.muscleGroup);
    this.muscleGroup = "";
  }


  //https://stackoverflow.com/questions/55853879/convert-image-uri-to-file-or-blob/55858622#55858622

  /**
   * To upload images:
   *  1.- Get the base64 encoded img from ImagePicker
   *  2.- Convert the base64 img into Blob file and give it a name.
   *  3.- Save those objects of {name, blob} in an array of data to be uploaded to Firebase Storage as it accepts blob files.
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
        console.log(results);
        for (let i = 0; i < results.length; i++) {
          this.imagesPicked.push(`data:image/jpeg;base64,${results[i]}`);

          // Step 2.
          let blob = this.getBlob(results[i], ".jpg");
          
          // Step 3.
          this._imagesPicked.push({name: `image${i}.jpg`, blob})
        }
        console.log(this._imagesPicked);
      },
      error => console.log(error)
    );
  }

  private getBlob(b64Data:string, contentType:string, sliceSize:number= 512) {
    contentType = contentType || '';
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
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

  removeImage(imageIndex) {
    this.imagesPicked.splice(imageIndex, 1);
  }

  onAddExercise(form: NgForm) {
    this._exerciseService
      .createExercise(this.newExercise, this._imagesPicked)
      .then(() => {
        this.muscleGroup = "";
        this.newExercise = new Exercise();
        this._router.navigate(["home"]);
      });
  }

  imagePicked(event) {
    this._imagePicked = event.target.files[0];
  }
}
