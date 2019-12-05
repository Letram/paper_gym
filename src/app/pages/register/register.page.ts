import { User   } from "../../models/User";
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";

// jQuery
declare var $: any;

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  
  private user: User;
  private errorMessage: string = '';

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private authService: AuthService, private router: Router ) {}

  ngOnInit() {
    this.user = new User();
  }

  async register( registerForm: NgForm ){

    this.checkEmptyFields( registerForm );

    if ( registerForm.invalid ) {
      return;
    }

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

  // ──────────────── //
  //     AUXILIAR     //
  // ──────────────── //

  checkEmptyFields( registerForm: NgForm ) {

    const errorEmail    = registerForm.controls['email'   ].errors;
    const errorPassword = registerForm.controls['password'].errors;

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
