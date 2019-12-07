import { NgModule     } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { DefaultImagePipe } from './default-image.pipe';

@NgModule({
  declarations: [
    DefaultImagePipe
  ],
  exports: [
    DefaultImagePipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }