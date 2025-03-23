import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
  WritableSignal,
} from '@angular/core';
import { RadarChartComponent } from '@components/charts/radar/radar.component';
import {
  BaseTable,
  EfficiencyTable,
} from '@models/interfaces/base-table.model';
import { ReportChartService } from '@services/report-chart.service';
import { RadarChart } from '@shared/models/radar.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-team-features',
  templateUrl: './team-features.component.html',
  styleUrls: ['./team-features.component.scss'],
  imports: [NgIf, RadarChartComponent],
})
export class HomeTeamFeaturesComponent implements OnChanges {
  @Input({ required: true }) data!: BaseTable;
  featuresByTeamMember: WritableSignal<RadarChart | undefined> =
    signal(undefined);
  constructor(private _reportChartService: ReportChartService) {}

  ngOnChanges(): void {
    this.featuresByTeamMember.set(
      this._reportChartService.getFeaturesByTeamMember(
        this.data as EfficiencyTable
      )
    );
  }
}
