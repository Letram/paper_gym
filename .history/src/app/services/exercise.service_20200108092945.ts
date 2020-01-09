import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Exercise } from "../models/Exercise";
import { AuthService } from "./auth.service";
import { typeWithParameters } from "@angular/compiler/src/render3/util";

@Injectable({
  providedIn: "root"
})
export class ExerciseService {
  constructor(
    private _afs: AngularFirestore,
    private _afStorage: AngularFireStorage,
    private _authService: AuthService
  ) {}

  getMuscleGroups(): Observable<any> {
    let currentUser = this._authService.getUserStored();
    return this._afs
      .collection("USERS")
      .doc(currentUser.uid)
      .valueChanges();
  }

  updateMuscleGroup(newMuscleGroupArray: string[]) {
    let currentUser = this._authService.getUserStored();

    return this._afs
      .collection("USERS")
      .doc(currentUser.uid)
      .set({ MUSCLEGROUPS: newMuscleGroupArray });
  }

  getExercises(): Observable<any> {
    let currentUser = this._authService.getUserStored();
    return this._afs
      .collection("USERS")
      .doc(currentUser.uid)
      .collection("EXERCISES")
      .snapshotChanges();
  }

  getExercisesOfDay(index: number): Promise<any>{
    let currentUser = this._authService.getUserStored();
    var exerciseRef = this._afs
    .collection("USERS")
    .doc(currentUser.uid)
    .collection("EXERCISES").ref;

    return exerciseRef.where(`days[${index}]`, "==", "true").get();
  }

  async createExercise(exerciseToAdd: Exercise, exerciseImages: any[]) {
    let currentUser = this._authService.getUserStored();

    /**
     * 1.- Upload exercise without images
     * 2.- Upload images and get their downloadURL
     * 3.- Update the exercise images with the download url provided
     */

    //Step 1.
    let exercisePathId: any = await this._afs
      .collection(`USERS`)
      .doc(currentUser.uid)
      .collection(`EXERCISES`)
      .add({ ...exerciseToAdd })
      .then(documentRef => {
        return { exerciseId: documentRef.id, exercisePath: documentRef.path };
      })
      .catch(error => console.log(`[UPLOAD EXERCISE ERROR] => ${error}`));
    console.log(exercisePathId);

    //Step 2.
    if (exerciseImages) {
      for (let index = 0; index < exerciseImages.length; index++) {
        const exerciseImage = exerciseImages[index];
        let imagePath = `IMAGES/${currentUser.uid}/${exercisePathId.exerciseId}/${exerciseImage.name}`;
        let url: string = await this._afStorage
          .ref(imagePath)
          .put(exerciseImage.blob as Blob)
          .then(fileSnapshot => {
            return fileSnapshot.ref.getDownloadURL().then(url => url);
          })
          .catch(error => console.log(`[UPLOAD IMG ERROR] => ${error}`));
        console.log(`Upload image url => ${url}`);
        exerciseToAdd.images.push(url);
      }
    }

    //Step 3.
    return this._afs
      .collection("USERS")
      .doc(currentUser.uid)
      .collection("EXERCISES")
      .doc(exercisePathId.exerciseId)
      .update({ ...exerciseToAdd });
  }

  async updateExercise(exerciseToUpdate: Exercise, exerciseId: string) {
    let currentUser = this._authService.getUserStored();
    let exerciseRef = `USERS/${currentUser.uid}/EXERCISES/${exerciseId}`;
    return this._afs.doc(exerciseRef).set({ ...exerciseToUpdate });
  }

  async removeExercise(exerciseId: string) {
    let currentUser = this._authService.getUserStored();

    return this._afs
      .collection("USERS")
      .doc(currentUser.uid)
      .collection("EXERCISES")
      .doc(exerciseId)
      .delete();
  }
}
