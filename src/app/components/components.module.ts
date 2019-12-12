import { NgModule     } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { NavbarComponent  } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    SpinnerComponent
  ],
})
export class ComponentsModule { }