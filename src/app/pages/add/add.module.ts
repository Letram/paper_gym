import { NgModule     } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AddPage } from './add.page';
import { AddPageRoutingModule } from './add-routing.module';

// Components
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ComponentsModule,
    AddPageRoutingModule
  ],
  declarations: [AddPage]
})
export class AddPageModule {}
