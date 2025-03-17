import { BaseItem } from './base-item.model';

export interface Header extends BaseItem {
  value: string;
  type: string;
  hidden?: boolean;
}
