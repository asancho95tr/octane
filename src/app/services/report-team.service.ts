import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { EfficiencyTable } from '@models/interfaces/base-table.model';
import { Row } from '@models/interfaces/row.model';
import { Efficiency } from '@models/interfaces/efficiency.model';
import { TEAM_EFICIENCY_HEADERS } from '@utils/static.data';
import { Header } from '@models/interfaces/header.model';

@Injectable({
  providedIn: 'root',
})
export class ReportTeamService extends ReportBaseService {
  getTeamEfficiency(data: Row[]): EfficiencyTable {
    const teamMembers: string[] = [
      ...new Set(
        data.map((element: Row) => this.getOwner(element)) as string[]
      ),
    ];
    const efficiency: Efficiency = this.getEfficiency(data);
    efficiency.teamEfficiency = [];
    teamMembers.forEach((member: string) => {
      const memberName: string =
        member && member !== '' ? member : 'Sin asignar';
      const dataOfMember: Row[] = data.filter(
        (element: Row) => this.getOwner(element) === member
      );
      efficiency.teamEfficiency?.push({
        member: { value: memberName },
        ...this.getEfficiency(dataOfMember),
      });
    });

    return {
      name: 'Tareas por persona',
      headers: TEAM_EFICIENCY_HEADERS.filter((header: Header) => !header.hidden),
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
}
