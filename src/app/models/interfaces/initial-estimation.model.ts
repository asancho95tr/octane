import { Row } from './row.model';

export interface InitialEstimation {
  feature: string;
  data: Row[];
  initialEstimated?: number;
  estimated: number;
  invested: number;
}
