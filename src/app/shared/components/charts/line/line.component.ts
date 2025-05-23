import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-line-chart',
  templateUrl: './line.component.html',
  imports: [BaseChartDirective],
})
export class LineChartComponent {
  @Input({ required: true }) title: string = '';
  @Input() data: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  lineChartLegend = true;
}
