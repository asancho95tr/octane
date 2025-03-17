import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { Efficiency } from '@models/interfaces/efficiency.model';
import { Row } from '@models/interfaces/row.model';
import {
  BaseTable,
  EfficiencyTable,
} from '@models/interfaces/base-table.model';
import { EFFICIENY_HEADERS } from '@utils/static.data';

@Injectable({
  providedIn: 'root',
})
export class ReportProjectService extends ReportBaseService {
  getProjectEfficiency(data: Row[]): EfficiencyTable {
    const efficiency: Efficiency = this.getEfficiency(data);
    return {
      name: 'Proyecto',
      headers: EFFICIENY_HEADERS,
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
