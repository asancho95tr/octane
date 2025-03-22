import { BaseTable } from '@models/interfaces/base-table.model';
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
  WritableSignal,
} from '@angular/core';
import { LineChartComponent } from '@components/charts/line/line.component';
import { ReportBacklogService } from '@services/report-backlog.service';
import { ReportChartService } from '@services/report-chart.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-backlog-charts',
  templateUrl: './backlog-charts.component.html',
  styleUrls: ['./backlog-charts.component.scss'],
  imports: [NgIf, LineChartComponent],
})
export class HomeBacklogChartsComponent implements OnChanges {
  @Input({ required: true }) data!: BaseTable;
  reportBySprint = signal(this._reportBacklogService.backlogBySprints);
  hoursHistoric: WritableSignal<
    ChartConfiguration<'line'>['data'] | undefined
  > = signal({ labels: [], datasets: [] });
  constructor(
    private _reportBacklogService: ReportBacklogService,
    private _reportChartService: ReportChartService
  ) {}

  ngOnChanges() {
    const reportBySprint = this.reportBySprint();
    if (this.data.rows.length > 0 && reportBySprint) {
      this.hoursHistoric.set(
        this._reportChartService.getHoursHistoric(this.data, reportBySprint)
      );
    }
  }
}
