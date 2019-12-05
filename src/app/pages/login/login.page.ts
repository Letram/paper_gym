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
  private errorMessage: string = '';

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

    this.authService.login( this.user )
      .then(( response ) => {
        if ( response ) {
          this.router.navigate([ '/home' ]);
        } else {
          this.showErrorMessage( 'Datos incorrectos' );
        }
      })
      .catch(( error ) => {
        this.showErrorMessage( 'Se ha producido un error' );
        console.log( `[ ERROR MESSAGE ] » ${ error }` );
      });

  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  checkEmptyFields( loginForm: NgForm ) {

    const errorEmail    = loginForm.controls['email'   ].errors;
    const errorPassword = loginForm.controls['password'].errors;

    if ( errorEmail !== null ) {
      this.highlightBorder( 'email' );
    }

    if ( errorPassword !== null ) {
      this.highlightBorder( 'password' );
    }
  }

  highlightBorder( inputName: string ) {

    $( `.entrada[name='${ inputName }']` ).addClass( 'red-border' );
    
    setTimeout( () => {
      $( `.entrada[name='${ inputName }']` ).removeClass( 'red-border' );
    }, 250);

  }

  showErrorMessage( message: string ) {

    this.errorMessage = message;
    
    $( '.error-message' ).css( 'opacity', '1');
    
    setTimeout( () => {
      $( '.error-message' ).css( 'opacity', '0');
    }, 2500);

  }
}
