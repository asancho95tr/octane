import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReportChartService } from '@services/report-chart.service';
import { BarChartComponent } from '@components/charts/bar/bar.component';
import { BarChart } from '@shared/models/bar.interface';
import { InitialEstimation } from '@models/interfaces/initial-estimation.model';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LocalStorageService } from '@core/local-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-initial-estimation-charts',
  templateUrl: './initial-estimation.component.html',
  styleUrls: ['./initial-estimation.component.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatButton,
    MatIcon,
    MatInput,
    BarChartComponent,
  ],
})
export class HomeInitialEstimationComponent implements OnChanges {
  @Input({ required: true }) data!: InitialEstimation[];
  dataset: WritableSignal<BarChart | undefined> = signal(undefined);
  constructor(
    private _reportChartService: ReportChartService,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnChanges() {
    this.refreshChart();
  }

  refreshChart(save: boolean = false) {
    if (!save) {
      const initialEstimation: InitialEstimation[] = JSON.parse(
        localStorage.getItem('initialEstimation') ?? '[]'
      );
      this.data.forEach((item: InitialEstimation) => {
        const initialEstimationSaved = initialEstimation.find(
          (value: InitialEstimation) => value.feature === item.feature
        );
        item.initialEstimated = initialEstimationSaved?.initialEstimated;
      });
    }
    this.data.sort((a, b) =>
      a.feature.toLowerCase().localeCompare(b.feature.toLowerCase())
    );
    this.dataset.set(this._reportChartService.getInitialEstimation(this.data));
    if (save) {
      localStorage.setItem('initialEstimation', JSON.stringify(this.data));
    }
  }
}
