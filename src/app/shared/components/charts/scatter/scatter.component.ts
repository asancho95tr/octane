import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-scatter-chart',
  templateUrl: './scatter.component.html',
  imports: [BaseChartDirective],
})
export class ScatterChartComponent {
  @Input({ required: true }) title: string = '';
  @Input() data: ChartConfiguration<'scatter'>['data']['datasets'] = [
    {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: -2 },
        { x: 4, y: 4 },
        { x: 5, y: -3 },
      ],
      label: 'Series A',
      pointRadius: 10,
    },
  ];

  options: ChartConfiguration<'scatter'>['options'] = {
    responsive: true,
  };
}
