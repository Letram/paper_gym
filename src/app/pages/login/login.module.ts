import { NgModule     } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { LoginPage } from './login.page';
import { LoginPageRoutingModule } from './login-routing.module';

// Components
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ComponentsModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
