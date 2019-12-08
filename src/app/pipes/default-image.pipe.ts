import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

  transform( images: any[] ): string {
    return images.length === 0 ? './assets/img/default.jpg' : `${ images[0].url }`;
  }

}
