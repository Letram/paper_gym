import { Router           } from '@angular/router';
import { NavController    } from '@ionic/angular';
import { Component, Input } from '@angular/core';

// Services
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  @Input() returnButton: boolean = false;

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private navController: NavController, private authService: AuthService, private router: Router ) { }

  return() {
    this.navController.back();
  }

  logout(){
    this.authService.logout().then( () => this.router.navigate(['']) );
  }

}
