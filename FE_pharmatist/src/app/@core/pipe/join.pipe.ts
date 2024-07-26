import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: any[], separator: string = ', '): any {
    return value ? value.join(separator) : null;
  }
}
