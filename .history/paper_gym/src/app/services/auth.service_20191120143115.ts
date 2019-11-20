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
      let token: any;
      await loggedUser.user.getIdTokenResult().then(response => {
        console.log({
          createdAt: Date.now(),
          expires: Date.parse(response.expirationTime)
        });
        if (response.token) token = true;
        else token = false;
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            token: response.token,
            expiresAt: Date.parse(response.expirationTime)
          })
        );
        localStorage.setItem("userStored", JSON.stringify(loggedUser.user));
      });
      return token;
    } catch (error) {
      console.log(`[LOGIN ERR SERVICE] => ${error}`);
    }
  }

  async register(user) {
    try {
      return await this._afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (error) {
      console.log(`[REGISTER ERR SERVICE] => ${error}`);
    }
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
