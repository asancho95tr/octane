import { Pipe, PipeTransform } from '@angular/core';
import { HeadersType } from '@models/enums/headers-type.enum';

@Pipe({
  name: 'appData',
})
export class DataPipe implements PipeTransform {
  transform(value: string | number, type: string, ...args: string[]) {
    switch (type) {
      case HeadersType.PERCENT:
        return `${(Number(value) * 100).toFixed(2)}%`;
      case HeadersType.NUMBER:
      default:
        return (value && value !== '') || value === 0 ? value : ' - ';
    }
  }
}
