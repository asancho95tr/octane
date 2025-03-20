import { Injectable } from '@angular/core';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';
import { BaseItem } from '@models/interfaces/base-item.model';
import { BaseTable } from '@models/interfaces/base-table.model';
import {
  BacklogItemProperty,
  TeamItemProperty,
} from '@models/interfaces/octane-report.model';
import { Row } from '@models/interfaces/row.model';
import { COLOR } from '@shared/utils/colors.data';

@Injectable({
  providedIn: 'root',
})
export class ReportChartService {
  getTasksByTeamMember(data: BaseTable) {
    const labels = data.rows.map(
      (row: Record<string, BaseItem>) =>
        row[TeamItemProperty.member].text?.toString() ?? ''
    );
    const datasets = [
      {
        data: labels
          .map((person: string) =>
            data.rows
              .filter(
                (row: Record<string, BaseItem>) =>
                  row[TeamItemProperty.member].text === person
              )
              .map(
                (row: Record<string, BaseItem>) =>
                  Number(row[TeamItemProperty.doneOrClosed].text) ?? 0
              )
          )
          .flat(),
      },
    ];
    return {
      datasets: datasets,
      labels: labels.map((person: string) => person.split(' (')[0]),
    };
  }
  getHoursHistoric(data: BaseTable, reportBySprint: Record<string, Row[]>[]) {
    const labels = [
      ...new Set(
        data.rows.map(
          (item: Record<string, BaseItem>) =>
            item[BacklogItemProperty.sprint].text?.toString() || ''
        )
      ),
    ];

    return {
      labels: labels,
      datasets: [
        {
          data: this.#getSummatoryBySprint(
            labels,
            reportBySprint,
            SummatoryKeys.INVESTED
          ).flat(),
          label: 'Invested',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: COLOR.INVESTED,
        },
        {
          data: this.#getSummatoryBySprint(
            labels,
            reportBySprint,
            SummatoryKeys.REMAINING
          ).flat(),
          label: 'Remaining',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: COLOR.REMAINING,
        },
        {
          data: this.#getSummatoryBySprint(
            labels,
            reportBySprint,
            SummatoryKeys.ESTIMATED
          ),
          label: 'Estimated',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: COLOR.ESTIMATED,
        },
      ],
    };
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
