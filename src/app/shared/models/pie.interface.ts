import { ChartOptions } from 'chart.js';

export interface PieChart {
  options?: ChartOptions<'pie'>;
  labels: (string | string[])[];
  datasets: {
    data: number[];
  }[];
  legend?: boolean;
}
