import { ChartConfiguration } from 'chart.js';

export interface BarChart {
  options?: ChartConfiguration<'bar'>['options'];
  data: ChartConfiguration<'bar'>['data'];
  legend?: boolean;
}
