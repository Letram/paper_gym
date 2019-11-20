import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  public isLogged: any = false;
  constructor(private _afAuth: AngularFireAuth) {
    _afAuth.authState.subscribe(user => {
      this.isLogged = user;
      console.log(user);
    });
  }


  async login(user) {
    try {
      let loggedUser = await this._afAuth.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
      let token = "";
      await loggedUser.user.getIdTokenResult().then(
        (response) => console.log(response)
      )
      return token;
    } catch (error) {
      console.log(`[LOGIN ERR] => ${error}`);
    }
  }

  async register(user){
    try{
      return await this._afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
    }catch(error){
      console.log(`[REGISTER ERR] => ${error}`);
    }
  }

  async logout(){
    try{
      return await this._afAuth.auth.signOut();
    }catch(error){
      console.log(`[LOGOUT ERR] => ${error}`);
    }
  }
}
