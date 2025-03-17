import { BaseTable, EfficiencyTable } from './base-table.model';

export interface OctaneReport {
  backlog: BaseTable;
  team: BaseTable;
  project: EfficiencyTable;
}
