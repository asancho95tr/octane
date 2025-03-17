import { BaseItem } from './base-item.model';
import { Efficiency } from './efficiency.model';
import { Header } from './header.model';

export interface BaseTable {
  name: string;
  headers: Header[];
  rows: Record<string, BaseItem>[];
}

export interface EfficiencyTable extends BaseTable {
  efficiency: Efficiency;
}
