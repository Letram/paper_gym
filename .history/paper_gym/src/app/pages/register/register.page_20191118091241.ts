import { User } from "../../models/User";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  private user: User;
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {
    console.log("Register page init...");
  }

  async register(){
    const registeredUser = await this._authService.register(this.user);
    if(registeredUser){
      console.log("User created!");
    }
  }
}
