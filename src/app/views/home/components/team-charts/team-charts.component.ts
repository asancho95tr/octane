import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
  WritableSignal,
} from '@angular/core';
import { PieChartComponent } from '@components/charts/pie/pie.component';
import { RadarChartComponent } from '@components/charts/radar/radar.component';
import {
  BaseTable,
  EfficiencyTable,
} from '@models/interfaces/base-table.model';
import { ReportChartService } from '@services/report-chart.service';
import { PieChart } from '@shared/models/pie.interface';
import { RadarChart } from '@shared/models/radar.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-team-charts',
  templateUrl: './team-charts.component.html',
  styleUrls: ['./team-charts.component.scss'],
  imports: [NgIf, PieChartComponent, RadarChartComponent],
})
export class HomeTeamChartsComponent implements OnChanges {
  @Input({ required: true }) data!: BaseTable;
  tasksByTeam: WritableSignal<PieChart | undefined> = signal(undefined);
  featuresByTeamMember: WritableSignal<RadarChart | undefined> =
    signal(undefined);
  constructor(private _reportChartService: ReportChartService) {}

  ngOnChanges(): void {
    this.tasksByTeam.set(
      this._reportChartService.getTasksByTeamMember(this.data)
    );
    this.featuresByTeamMember.set(
      this._reportChartService.getFeaturesByTeamMember(
        this.data as EfficiencyTable
      )
    );
  }
}
