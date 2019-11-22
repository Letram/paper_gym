import { Component, OnInit } from "@angular/core";
import { ExerciseService } from "src/app/services/exercise.service";
import { Exercise } from "src/app/models/Exercise";
import { NgForm } from "@angular/forms";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Router } from "@angular/router";
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
  private _imagesPicked: File[];
  private _imagePickerOptions: any;
  constructor(
    private _exerciseService: ExerciseService,
    private _imagePicker: ImagePicker,
    private _router: Router,
  ) {
    this.newExercise = new Exercise();
    this.muscleGroup = "";
  }

  ngOnInit() {
    console.log("Add exercise page init...");
    this.newExercise = new Exercise();
    this.muscleGroup = "";
  }

  addMuscleGroup() {
    this.newExercise.muscleGroups.push(this.muscleGroup);
    this.muscleGroup = "";
  }


  //https://stackoverflow.com/questions/55853879/convert-image-uri-to-file-or-blob/55858622#55858622

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
    this._imagePicker.getPictures(this._imagePickerOptions).then(
      results => {
        console.log(results);
        for (let i = 0; i < results.length; i++) {
          console.log(results[i]);
          this.imagesPicked.push(`data:image/jpeg;base64,${results[i]}`);
          let blob = this.getBlob(results[i], ".jpg");
          let fileFromBlob = new File([blob], `image${i}.jpg`);
          //add imageFile to imageFile array...
        }
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
    console.log(`${imageIndex}`);
    this.imagesPicked.splice(imageIndex, 1);
  }

  onAddExercise(form: NgForm) {
    this._exerciseService
      .createExercise(this.newExercise, this._imagePicked)
      .then(() => {
        this.muscleGroup = "";
        this.newExercise = new Exercise();
        this._router.navigate(["/home"]);
      });
  }

  imagePicked(event) {
    this._imagePicked = event.target.files[0];
  }
}
