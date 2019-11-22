import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Exercise } from "../models/Exercise";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class ExerciseService {
  constructor(
    private _afs: AngularFirestore,
    private _afStorage: AngularFireStorage,
    private _authService: AuthService
  ) {}

  getExercises(): Observable<any> {
    let currentUser = this._authService.getUserStored();
    return this._afs
      .collection("USERS")
      .doc(currentUser.uid)
      .valueChanges();
  }

  async createExercise(exerciseToAdd: Exercise, exerciseImage: File) {
    let currentUser = this._authService.getUserStored();

    //exerciseToAdd.images.push(url);
    let exercisePathId:any = await this._afs
      .collection(`USERS`).doc(currentUser.uid).collection(`EXERCISES`).add({ ...exerciseToAdd })
      .then(documentRef => {
        return { exerciseId: documentRef.id, exercisePath: documentRef.path };
      })
      .catch(error => console.log(`[UPLOAD EXERCISE ERROR] => ${error}`));
    console.log(exercisePathId);
    //this._afs.collection(`USERS/${currentUser.uid}`).add(exerciseToAdd);
    //this._afs.firestore.collection(`IMAGES/${currentUser.user.uid}`).add()
    let imagePath = `IMAGES/${currentUser.uid}/${exercisePathId.exerciseId}/${exerciseImage.name}`;
    let url: string = await this._afStorage.ref(imagePath).put(exerciseImage)
      .then(fileSnapshot => {
        return fileSnapshot.ref.getDownloadURL().then(url => url);
      })
      .catch(error => console.log(`[UPLOAD IMG ERROR] => ${error}`));
  }
}
