import { NgModule     } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ExercisePage } from './exercise.page';
import { ExercisePageRoutingModule } from './exercise-routing.module';

// Components
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ComponentsModule,
    ExercisePageRoutingModule
  ],
  declarations: [ExercisePage]
})
export class ExercisePageModule {}
