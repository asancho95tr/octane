import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HeadersType } from '@models/enums/headers-type.enum';
import { BaseItem } from '@models/interfaces/base-item.model';
import { BaseTable } from '@models/interfaces/base-table.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class HomeBaseComponent {
  @Input({ required: true }) data!: BaseTable;
  @Output() selectCell = new EventEmitter<{
    item: BaseItem;
    property: string;
  }>();

  get headersNames() {
    return this.data.headers.map((header) => header.value);
  }

  HeadersType = HeadersType;

  selectData(item: BaseItem, property: string) {
    this.selectCell.emit({ item, property });
  }
}
