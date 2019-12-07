import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

// Pipes
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    PipesModule,
    CommonModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
