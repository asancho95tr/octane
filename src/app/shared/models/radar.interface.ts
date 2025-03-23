import { ChartOptions } from 'chart.js';

export interface RadarChart {
  options?: ChartOptions<'radar'>;
  labels: (string | string[])[];
  datasets: { data: number[]; label: string }[];
  legend?: boolean;
  backgroundColor?: string;
}
