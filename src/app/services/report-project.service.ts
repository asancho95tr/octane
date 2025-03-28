import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { Efficiency } from '@models/interfaces/efficiency.model';
import { Row } from '@models/interfaces/row.model';
import { EfficiencyTable } from '@models/interfaces/base-table.model';
import { EFFICIENY_HEADERS } from '@utils/static.data';
import { Header } from '@models/interfaces/header.model';

@Injectable({
  providedIn: 'root',
})
export class ReportProjectService extends ReportBaseService {
  /**
   * Generates the project efficiency report.
   *
   * @param data - The rows with the data to generate the report.
   * @returns An EfficiencyTable object with the report data.
   */
  getProjectEfficiency(data: Row[]): EfficiencyTable {
    const efficiency: Efficiency = this.getEfficiency(data);
    return {
      name: 'Proyecto',
      headers: EFFICIENY_HEADERS.filter(
        (header: Header) =>
          !header.hidden && this.checkIfCanShowEfficiency(header.value)
      ),
      rows: [
        {
          tasksWithoutSprint: efficiency.tasksWithoutSprint,
          estimatedVsInvested: efficiency.efficiency,
        },
      ],
      efficiency: efficiency,
    };
  }
}
