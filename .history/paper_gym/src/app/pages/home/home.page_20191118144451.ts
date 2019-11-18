import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public currentUser: any;
  constructor(private _authService:AuthService, private _router: Router) { }

  ngOnInit() {
    console.log("Home page init...");
    this.currentUser = this._authService.isLogged;
    console.log(this.currentUser);
  }

  logout(){
    this._authService.logout().then(
      () => this._router.navigate([""])
    );
  }
}
