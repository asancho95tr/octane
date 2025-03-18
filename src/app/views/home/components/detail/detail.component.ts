import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnChanges,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomeBaseComponent } from '../base.component';
import { DataPipe } from '@pipes/data.pipe';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { BaseItem } from '@models/interfaces/base-item.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatTableModule,
    DataPipe,
    MatSort,
    MatSortModule,
  ],
})
export class HomeDetailComponent
  extends HomeBaseComponent
  implements OnChanges
{
  currentSort: WritableSignal<Sort> = signal({ active: 'id', direction: '' });
  dataSource = new MatTableDataSource<Record<string, BaseItem>>();
  originalOrder = new MatTableDataSource<Record<string, BaseItem>>();

  ngOnChanges() {
    this.dataSource.data = this.data?.rows;
    this.originalOrder.data = [...this.dataSource.data];
    if (this.currentSort().direction !== '') {
      this.sortData(this.currentSort());
    }
  }

  sortData(sort: Sort) {
    this.currentSort.set(sort);
    const isAsc = sort.direction === 'asc';
    const isDes = sort.direction === 'desc';
    const isOriginal = !isAsc && !isDes;
    if (!isOriginal) {
      const newRows = [...this.originalOrder.data];
      newRows.sort(
        (a: Record<string, BaseItem>, b: Record<string, BaseItem>) => {
          const property = sort.active;
          const aValue = a[property]?.text;
          const bValue = b[property]?.text;
          let sortValue = 0;
          if (aValue && bValue) {
            if (typeof aValue === 'number' && typeof bValue === 'number') {
              sortValue = aValue - bValue;
            } else {
              sortValue =
                aValue.toString().toUpperCase() <
                bValue.toString().toUpperCase()
                  ? -1
                  : 1;
            }
          }
          return isAsc ? sortValue : sortValue * -1;
        }
      );

      this.dataSource.data = newRows;
    } else {
      this.dataSource.data = [...this.originalOrder.data];
    }
  }
}
