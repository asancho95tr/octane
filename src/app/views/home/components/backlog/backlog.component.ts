import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HomeBaseComponent } from '../base.component';
import { DataPipe } from '@pipes/data.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { LineChartComponent } from '@components/charts/line/line.component';
import { ReportBacklogService } from '@services/report-backlog.service';
import { ChartConfiguration } from 'chart.js';
import { ReportChartService } from '@services/report-chart.service';
import { PieChartComponent } from '@components/charts/pie/pie.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatTooltip,
    MatTableModule,
    DataPipe,
    LineChartComponent,
  ],
})
export class HomeBacklogComponent extends HomeBaseComponent {
  reportBySprint = signal(this._reportBacklogService.backlogBySprints);
  hoursHistoric: WritableSignal<
    ChartConfiguration<'line'>['data'] | undefined
  > = signal({ labels: [], datasets: [] });
  constructor(
    private _reportBacklogService: ReportBacklogService,
    private _reportChartService: ReportChartService
  ) {
    super();
  }

  ngOnChanges() {
    const reportBySprint = this.reportBySprint();
    if (this.data.rows.length > 0 && reportBySprint) {
      this.hoursHistoric.set(
        this._reportChartService.getHoursHistoric(this.data, reportBySprint)
      );
    }
  }
}
