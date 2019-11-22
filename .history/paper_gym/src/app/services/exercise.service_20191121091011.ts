import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from '../models/Exercise';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private _afs: AngularFirestore, private _authService: AuthService) { }

  getExercises(): Observable<any>{
    let currentUser = this._authService.getUserStored();
    return this._afs.collection("USERS").doc(currentUser.user.uid).valueChanges();
  }

  createExercise(exerciseToAdd: Exercise, exerciseImage: File){
    let currentUser = this._authService.getUserStored();
    let imagePath = `${currentUser.user.uid}/${exerciseImage.name}`;
    console.log(imagePath);
    //this._afs.firestore.collection(`IMAGES/${currentUser.user.uid}`).add()
  }
}
