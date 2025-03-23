import { Pipe, PipeTransform } from '@angular/core';
import { HeadersType } from '@models/enums/headers-type.enum';

@Pipe({
  name: 'appData',
})
export class DataPipe implements PipeTransform {
  /**
   * Returns a formatted string based on the given value and type.
   * - If `type` is `PERCENT`, returns a string with the value multiplied by 100 and rounded to 2 decimal places, suffixed with '%'
   * - If `type` is `NUMBER`, returns the value as is, unless it is an empty string, in which case returns ' - '
   * @param value the value to format
   * @param type the type of the value, either `PERCENT` or `NUMBER`
   * @returns a formatted string
   */
  transform(value: string | number, type: string) {
    switch (type) {
      case HeadersType.PERCENT:
        return `${(Number(value) * 100).toFixed(2)}%`;
      case HeadersType.NUMBER:
      default:
        return (value && value !== '') || value === 0 ? value : ' - ';
    }
  }
}
