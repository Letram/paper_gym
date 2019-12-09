import { NgModule     } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

// Components
import { ComponentsModule } from '../../components/components.module';

// Pipes
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    PipesModule,
    CommonModule,
    ComponentsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
