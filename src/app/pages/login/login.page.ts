import { User } from '../../models/User';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

// jQuery
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  private user: User;

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private authService: AuthService, private router: Router ) {}

  ngOnInit() {

    this.user = new User();

    if ( this.authService.checkUser() ) {
      this.router.navigate([ '/home' ]);
    }

  }

  async login( loginForm: NgForm ) {

    this.checkEmptyFields( loginForm );

    if ( loginForm.invalid ) {
      return;
    }

    this.authService.login(this.user)
    .then(
      ( response ) => {
        console.log(response);
        this.router.navigate([ '/home' ]);
      }
    ).catch(
      ( error ) => {
        console.log(`[LOGIN ERR] => ${error}`);
      }
    );

  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  checkEmptyFields( loginForm: NgForm ) {

    const errorEmail    = loginForm.controls['email'   ].errors;
    const errorPassword = loginForm.controls['password'].errors;

    if ( errorEmail !== null ) {
      $('.entrada[name="email"]').addClass('red-border');
    } else {
      $('.entrada[name="email"]').removeClass('red-border');
    }

    if ( errorPassword !== null ) {
      $('.entrada[name="password"]').addClass('red-border');
    } else {
      $('.entrada[name="password"]').removeClass('red-border');
    }
  }
}
