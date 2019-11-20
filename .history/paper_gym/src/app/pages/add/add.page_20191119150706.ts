import { Component, OnInit } from '@angular/core';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Exercise } from 'src/app/models/Exercise';
import {NgForm} from "@angular/forms";
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public muscleGroup: string;
  public newExercise: Exercise;

  constructor( private _exerciseService: ExerciseService ) {
    this.newExercise = new Exercise();
    this.muscleGroup = "";
   }

  ngOnInit() {
    console.log("Add exercise page init...");
  }

}
