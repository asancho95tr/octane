import { Row } from './row.model';

export interface BaseItem {
  value?: string | number | Row[];
  text?: string | number;
  class?: string;
}
