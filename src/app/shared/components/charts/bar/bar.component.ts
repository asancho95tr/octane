import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PieChart } from '@shared/models/pie.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bar-chart',
  templateUrl: './bar.component.html',
  imports: [BaseChartDirective],
})
export class BarChartComponent {
  @Input({ required: true }) title: string = '';
  @Input() data: PieChart = {
    options: { responsive: false },
    labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
    legend: true,
  };

  legend = true;
  options = { responsive: true };
}
