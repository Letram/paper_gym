import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

  transform( imagePath: string ): string {
    return imagePath ? './assets/img/default.jpg' : `${ imagePath }`;
  }

}
