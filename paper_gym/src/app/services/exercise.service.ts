import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private _afs: AngularFirestore) { }

  getExercises(uid: string): Observable<any>{
    return this._afs.collection("USERS").doc(uid).valueChanges();
  }
}
