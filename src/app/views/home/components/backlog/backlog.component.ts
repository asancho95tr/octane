import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HomeBaseComponent } from '../base.component';
import { DataPipe } from '@pipes/data.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { LineChartComponent } from '@components/charts/line/line.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
  imports: [
    NgFor,
    NgClass,
    MatTooltip,
    MatTableModule,
    DataPipe,
    LineChartComponent,
  ],
})
export class HomeBacklogComponent extends HomeBaseComponent {}
