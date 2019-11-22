import { Component, OnInit } from "@angular/core";
import { ExerciseService } from "src/app/services/exercise.service";
import { Exercise } from "src/app/models/Exercise";
import { NgForm } from "@angular/forms";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Router } from '@angular/router';
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
  private _imagePickerOptions: any;
  constructor(
    private _exerciseService: ExerciseService,
    private _imagePicker: ImagePicker,
    private _router: Router
  ) {
    this.newExercise = new Exercise();
    this.muscleGroup = "";
  }

  ngOnInit() {
    console.log("Add exercise page init...");
    this.newExercise = new Exercise();
    this.muscleGroup = "";
  }

  addMuscleGroup(){
    this.newExercise.muscleGroups.push(this.muscleGroup);
    this.muscleGroup= "";
  }

  pickImages() {
    this._imagePickerOptions = {
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
      (results) => {
        console.log(results);
        for (let i = 0; i < results.length; i++) {
          this.imagesPicked.push(`data:image/jpeg;base64,${results[i]}`);
        }
      },
      (error) => console.log(error)
    );
  }

  removeImage(imageIndex){
    console.log(`${imageIndex}`);
    this.imagesPicked.splice(imageIndex, 1);
  }

  onAddExercise(form: NgForm){
    this._exerciseService.createExercise(this.newExercise, this._imagePicked).then(
      () => {
        this.muscleGroup = "";
        this.newExercise = new Exercise();
        this._router.navigate(["/home"]);
      }
    );
  }

  imagePicked(event){
    this._imagePicked = event.target.files[0];
  }
}
