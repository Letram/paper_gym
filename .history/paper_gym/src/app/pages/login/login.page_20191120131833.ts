import { Router } from "@angular/router";
import { User } from "../../models/User";
import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  private user: User;
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {
    console.log("Login page init...");
    this.user = new User();
  }

  async login() {
    const loggedUser = await this._authService.login(this.user);
    console.log(loggedUser);
    if (loggedUser) {
      console.log("User logged!");
      this._router.navigate(["/home"]);
    }
  }
}
