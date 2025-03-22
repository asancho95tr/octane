import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PieChart } from '@shared/models/pie.interface';
import { RadarChart } from '@shared/models/radar.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-radar-chart',
  templateUrl: './radar.component.html',
  imports: [BaseChartDirective],
})
export class RadarChartComponent {
  @Input({ required: true }) title: string = '';
  @Input() data: RadarChart = {
    options: { responsive: false },
    labels: [
      'Eating',
      'Drinking',
      'Sleeping',
      'Designing',
      'Coding',
      'Cycling',
      'Running',
    ],
    datasets: [
      { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' },
    ],
    legend: true,
  };

  options = { responsive: true, maintainAspectRatio: false };
}
