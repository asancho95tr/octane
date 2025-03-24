import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BarChart } from '@shared/models/bar.interface';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bar-chart',
  templateUrl: './bar.component.html',
  imports: [BaseChartDirective],
})
export class BarChartComponent {
  @Input({ required: true }) title: string = '';
  @Input() data: BarChart = {
    options: { responsive: false },
    data: {
      labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
      datasets: [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series C' },
      ],
    },
    legend: true,
  };

  options = { responsive: true, maintainAspectRatio: false };
  legend = true;
}
