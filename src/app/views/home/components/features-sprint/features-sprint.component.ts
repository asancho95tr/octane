import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
  WritableSignal,
} from '@angular/core';
import { ScatterChartComponent } from '@components/charts/scatter/scatter.component';
import { BaseTable } from '@models/interfaces/base-table.model';
import { ReportBacklogService } from '@services/report-backlog.service';
import { ReportChartService } from '@services/report-chart.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-features-sprint',
  templateUrl: './features-sprint.component.html',
  styleUrls: ['./features-sprint.component.scss'],
  imports: [NgIf, ScatterChartComponent],
})
export class HomeFeaturesSprintComponent implements OnChanges {
  @Input({ required: true }) data!: BaseTable;
  reportBySprint = signal(this._reportBacklogService.backlogBySprints);
  dataset: WritableSignal<
    ChartConfiguration<'scatter'>['data']['datasets'] | undefined
  > = signal([]);
  constructor(
    private _reportBacklogService: ReportBacklogService,
    private _reportChartService: ReportChartService
  ) {}

  ngOnChanges() {
    const reportBySprint = this.reportBySprint();
    if (this.data.rows.length > 0 && reportBySprint) {
      this.dataset.set(
        this._reportChartService.getFeaturesBySprint(reportBySprint)
      );
    }
  }
}
