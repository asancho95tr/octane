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
  /**
   * Creates a pie chart with the number of tasks done or closed by each team member.
   * @param data BaseTable with the data to be processed
   * @returns PieChart with the team members as labels and the number of done or closed tasks as data
   */
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

  /**
   * Generates a radar chart data structure where each dataset corresponds to a team member
   * and each axis of the radar chart represents a feature.
   *
   * @param data - EfficiencyTable containing team efficiency data including features.
   * @returns RadarChart - An object containing labels for features and datasets for each team member.
   */

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

  /**
   * Generates a scatter chart where each point represents a feature in a sprint.
   * The x-axis is the sprint index, and the y-axis is the number of tasks
   * in that sprint.
   *
   * @param reportBySprint - The report data grouped by sprint.
   * @returns An array of datasets for a scatter chart.
   */
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
    return dataset;
  }

  /**
   * Generates a line chart configuration displaying the historic data of hours
   * invested, remaining, and estimated over multiple sprints.
   *
   * @param data - The base table containing rows with sprint information.
   * @param reportBySprint - The report data grouped by sprint.
   * @returns An object containing labels for the x-axis (sprint names) and datasets
   *          for invested, remaining, and estimated hours.
   */

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

  /**
   * Computes the summatory of a specific property for each sprint.
   *
   * @param labels - An array of sprint names used as labels.
   * @param reportBySprint - A list of records where each record maps a sprint name to its corresponding rows.
   * @param property - The property of the rows to be summed, specified by the SummatoryKeys enum.
   * @returns An array of numbers representing the sum of the given property for each sprint.
   */

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

  /**
   * Removes the email part from a name, if present.
   *
   * Examples:
   *   - 'John Doe (johndoe@example.com)' -> 'John Doe'
   *   - 'Jane Doe' -> 'Jane Doe'
   * @param name - The name to be processed
   * @returns The name without the email part
   */
  #removeMailFromName(name: string) {
    return name.split(' (')[0];
  }
}
