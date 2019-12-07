import { User   } from '../../models/User';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
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

  configuration = {
    spaceBetween: 0,
    slidesPerView: 1,
    autoHeight: true,
    pagination: false,
    navigation: false
  };

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

    if ( this.checkEmptyFields( loginForm ) )
      return;

    this.authService.login( this.user )
      .then(( response ) => {
        if ( response ) {
          this.router.navigate([ '/home' ]);
        } else {
          this.showErrorMessage( 'Something went wrong' );
        }
      })
      .catch(( exception ) => {
        this.showErrorMessage( exception.message );
      });

  }

  async register( registerForm: NgForm ){

    if ( this.checkEmptyFields( registerForm ) )
      return;

    this.authService.register( this.user )
      .then(( response ) => {
        if ( response ) {
          this.router.navigate([ '/home' ]);
        } else {
          this.showErrorMessage( 'Something went wrong' );
        }
      })
      .catch(( exception ) => {
        this.showErrorMessage( exception.message );
      });

  }

  next( slide, index ) {
    slide.slideTo( index );
  }

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  checkEmptyFields( loginForm: NgForm ): boolean {

    const email   : number = loginForm.controls['email'   ].value ? loginForm.controls['email'   ].value.trim().length : 0;
    const password: number = loginForm.controls['password'].value ? loginForm.controls['password'].value.trim().length : 0;

    if ( email    === 0 ) this.highlightBorder( 'email' );
    if ( password === 0 ) this.highlightBorder( 'password' );

    return email === 0 || password === 0;

  }

  highlightBorder( inputName: string ) {

    // Resaltamos la entrada
    $( `.input[name='${ inputName }']` ).addClass( 'red-border' );
    
    // Dejamos de resaltar la entrada pasado un tiempo
    setTimeout( () => {
      $( `.input[name='${ inputName }']` ).removeClass( 'red-border' );
    }, 250);

  }

  showErrorMessage( message: string ) {

    this.errorMessage = message;
    
    // Mostramos el mensaje de error
    $( '.error-message' ).css( 'opacity', '1');
    
    // Ocultamos el mensaje de error pasado un tiempo
    setTimeout( () => {
      $( '.error-message' ).css( 'opacity', '0');
    }, 2500);

  }
}
