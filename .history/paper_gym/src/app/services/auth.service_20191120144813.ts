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
      let success = false;
      await this.saveUserData(loggedUser).then(
        (response) => {
          console.log(response);
        }
      );
    } catch (error) {
      console.log(`[LOGIN ERR SERVICE] => ${error}`);
    }
  }

  async register(user) {
    try {
      let registeredUser = await this._afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      return await this.saveUserData(registeredUser);
      let success = false;
      await this.saveUserData(registeredUser).then(
        (response) => {
          console.log(response);
        }
      );
    } catch (error) {
      console.log(`[REGISTER ERR SERVICE] => ${error}`);
    }
  }

  private async saveUserData(userToSave: firebase.auth.UserCredential): Promise<boolean>{
    let success = false;
    await userToSave.user.getIdTokenResult().then(
      (tokenResult) => {
        if(tokenResult) success = true;
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            token: tokenResult.token,
            expiresAt: Date.parse(tokenResult.expirationTime)
          })
        );
        localStorage.setItem("userStored", JSON.stringify(userToSave.user));
      }
    )
    .catch(
      (error) => console.log(`[SAVE USER DATA ERR] => ${error}`)
    );
    return success;
  }

  async logout() {
    try {
      return await this._afAuth.auth.signOut().then(
        () => {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userStored');
        }
      ).catch((err) => {console.log(`[LOGOUT ERR SERVICE] => ${err}`)});
    } catch (error) {
      console.log(`[LOGOUT ERR] => ${error}`);
    }
  }

  public getUserToken() {
    return JSON.parse(localStorage.getItem("userToken"));
  }

  public checkUser(): boolean {
    let token = JSON.parse(localStorage.getItem("userToken"));
    if (token && token.expiresAt > Date.now()) {
      this.isLogged = JSON.parse(localStorage.getItem("userStored"));
      return true;
    }
    return false;
  }
}
