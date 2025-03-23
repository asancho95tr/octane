import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { Injectable } from '@angular/core';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';
import { BaseItem } from '@models/interfaces/base-item.model';
import {
  BaseTable,
  EfficiencyTable,
} from '@models/interfaces/base-table.model';
import { Efficiency } from '@models/interfaces/efficiency.model';
import {
  BacklogItemProperty,
  TeamItemProperty,
} from '@models/interfaces/octane-report.model';
import { Row } from '@models/interfaces/row.model';
import { PieChart } from '@shared/models/pie.interface';
import { RadarChart } from '@shared/models/radar.interface';
import { COLOR } from '@shared/utils/colors.data';

@Injectable({
  providedIn: 'root',
})
export class ReportChartService {
  getTasksByTeamMember(data: BaseTable): PieChart {
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
              .map((row: Record<string, BaseItem>) =>
                Number(row[TeamItemProperty.doneOrClosed].text)
              )
          )
          .flat(),
      },
    ];
    return {
      datasets: datasets,
      labels: labels.map((person: string) => this.#removeMailFromName(person)),
    };
  }

  getFeaturesByTeamMember(data: EfficiencyTable): RadarChart {
    const team = data.efficiency.teamEfficiency ?? [];
    const labels = [
      ...new Set(
        team
          .map((efficincy: Efficiency) => efficincy.featuresNames ?? [])
          .flat()
      ),
    ];
    const datasets = team.map((item: Efficiency) => {
      return {
        label: this.#removeMailFromName(item.member?.value?.toString() ?? ''),
        data: labels.map((feature: string) => {
          const featureItem = item.features?.find(
            (featureItem: BaseItem) => featureItem.text === feature
          );
          return Number(featureItem?.value);
        }),
      };
    });
    return {
      labels: labels,
      datasets: datasets,
    };
  }

  getFeaturesBySprint(reportBySprint: Record<string, Row[]>[]) {
    const sprints: string[] = reportBySprint.map(
      (item: Record<string, Row[]>) => Object.keys(item)[0]
    );
    const features = [
      ...new Set(
        reportBySprint
          .map(
            (item: Record<string, Row[]>, index: number) => item[sprints[index]]
          )
          .flat()
          .map((row: Row) => row[HeadersToCheck.FEATURE])
      ),
    ];
    const dataset = features.map((feature: string) => {
      return {
        label: feature,
        pointRadius: 10,

        data: reportBySprint
          .map((item: Record<string, Row[]>, index: number) => {
            const row = item[sprints[index]];
            return {
              x: index,
              y: row.filter(
                (row: Row) => row[HeadersToCheck.FEATURE] === feature
              ).length,
            };
          })
          .filter((item) => item.y > 0),
      };
    });
    console.log(dataset);
    return dataset;
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

  #removeMailFromName(name: string) {
    return name.split(' (')[0];
  }
}
