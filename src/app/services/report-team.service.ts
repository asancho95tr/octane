import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { EfficiencyTable } from '@models/interfaces/base-table.model';
import { Row } from '@models/interfaces/row.model';
import { Efficiency } from '@models/interfaces/efficiency.model';
import { TEAM_EFICIENCY_HEADERS } from '@utils/static.data';
import { Header } from '@models/interfaces/header.model';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class ReportTeamService extends ReportBaseService {
  /**
   * Calculates the efficiency of a team based on the provided data.
   * Splits the data by team members and computes individual efficiencies
   * as well as overall team efficiency.
   *
   * @param data - An array of Row objects representing the data of tasks.
   * @returns An EfficiencyTable containing the name, headers, rows, and efficiency
   *          for the team, including individual member efficiencies and features.
   */
  getTeamEfficiency(data: Row[]): EfficiencyTable {
    const teamMembers: string[] = [
      ...new Set(
        data.map((element: Row) => this.getOwner(element)) as string[]
      ),
    ];
    teamMembers.sort((a: string, b: string) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    const efficiency: Efficiency = this.getEfficiency(data);
    efficiency.teamEfficiency = [];
    teamMembers.forEach((member: string) => {
      const memberName: string =
        member && member !== '' ? member : 'Sin asignar';
      const dataOfMember: Row[] = data.filter(
        (element: Row) => this.getOwner(element) === member
      );
      const featuresNames = [
        ...new Set(data.map((element: Row) => this.getFeature(element))),
      ];
      efficiency.teamEfficiency?.push({
        member: { value: memberName },
        ...this.getEfficiency(dataOfMember),
        featuresNames: featuresNames,
        features: this.#getInvestedHoursByFeature(dataOfMember, featuresNames),
      });
    });

    return {
      name: 'Tareas por persona',
      headers: TEAM_EFICIENCY_HEADERS.filter(
        (header: Header) =>
          !header.hidden && this.checkIfCanShowEfficiency(header.value)
      ),
      rows: teamMembers.map((member: string) => {
        const memberName: string =
          member && member !== '' ? member : 'Sin asignar';
        const dataOfMember: Row[] = data.filter(
          (element: Row) => this.getOwner(element) === member
        );
        const efficiency = this.getEfficiency(dataOfMember);
        return {
          member: { text: memberName },
          doneOrClosed: efficiency.doneOrClosed ?? this.emptyItem,
          estimatedVsInvested: efficiency.efficiency,
        };
      }),
      efficiency: efficiency,
    };
  }

  /**
   * Given a set of data and a set of features, returns an array of objects with
   * the feature name and the total of invested hours in that feature.
   *
   * @param data The data to filter.
   * @param features The set of features to filter by.
   * @returns An array of objects with the feature name and the total invested hours.
   */
  #getInvestedHoursByFeature(data: Row[], features: string[]) {
    return features.map((feature: string) => ({
      text: feature,
      value: this.getTasksByFeature(data, feature)
        .map((element: Row) => Number(element[SummatoryKeys.INVESTED]))
        .reduce((sum: number, current: number) => sum + current, 0),
    }));
  }
}
