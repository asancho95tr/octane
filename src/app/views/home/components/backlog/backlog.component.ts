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
import { BaseTable } from '@models/interfaces/base-table.model';
import { Row } from '@models/interfaces/row.model';
import { ChartConfiguration } from 'chart.js';
import { BaseItem } from '@models/interfaces/base-item.model';
import { BacklogItemProperty } from '@models/interfaces/octane-report.model';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';

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
  efficiencyHistoric: WritableSignal<
    ChartConfiguration<'line'>['data'] | undefined
  > = signal({ labels: [], datasets: [] });
  constructor(private _reportBacklogService: ReportBacklogService) {
    super();
  }

  ngOnChanges() {
    const reportBySprint = this.reportBySprint();
    if (this.data.rows.length > 0 && reportBySprint) {
      this.#getEfficiencyHistoric(this.data, reportBySprint);
    }
  }

  #getEfficiencyHistoric(
    data: BaseTable,
    reportBySprint: Record<string, Row[]>[]
  ) {
    const labels = [
      ...new Set(
        data.rows.map(
          (item: Record<string, BaseItem>) =>
            item[BacklogItemProperty.sprint].text?.toString() || ''
        )
      ),
    ];

    this.efficiencyHistoric.set({
      labels: labels,
      datasets: [
        {
          data: this.#getSummatoryBySprint(
            labels,
            reportBySprint,
            SummatoryKeys.INVESTED
          ).flat(),
          label: 'Invested hours',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(27, 164, 210, 0.5)',
        },
        {
          data: this.#getSummatoryBySprint(
            labels,
            reportBySprint,
            SummatoryKeys.REMAINING
          ).flat(),
          label: 'Remaining hours',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(247, 56, 56, 0.5)',
        },
        {
          data: this.#getSummatoryBySprint(
            labels,
            reportBySprint,
            SummatoryKeys.ESTIMATED
          ),
          label: 'Estimated hours',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(92, 208, 34, 0.25)',
        },
      ],
    });
  }

  #getSummatoryBySprint(
    labels: string[],
    reportBySprint: Record<string, Row[]>[],
    property: SummatoryKeys
  ) {
    return labels.map((sprint: string) => {
      const rows = reportBySprint.find((sp) => sp[sprint])?.[sprint] ?? [];
      return rows
        .map((row: Row) => row[property])
        .reduce((sum: number, current: number) => sum + current, 0);
    });
  }
}
