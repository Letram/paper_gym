import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
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

//Gestures
import {IonicGestureConfig} from "../../utils/IonicGestureConfig";
import {LongPressModule} from "ionic-long-press";

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    PipesModule,
    CommonModule,
    ComponentsModule,
    HomePageRoutingModule,
    LongPressModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
