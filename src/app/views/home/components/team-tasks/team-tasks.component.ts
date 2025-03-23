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
import { BaseTable } from '@models/interfaces/base-table.model';
import { ReportChartService } from '@services/report-chart.service';
import { PieChart } from '@shared/models/pie.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-team-tasks',
  templateUrl: './team-tasks.component.html',
  styleUrls: ['./team-tasks.component.scss'],
  imports: [NgIf, PieChartComponent],
})
export class HomeTeamTasksComponent implements OnChanges {
  @Input({ required: true }) data!: BaseTable;
  tasksByTeam: WritableSignal<PieChart | undefined> = signal(undefined);

  constructor(private _reportChartService: ReportChartService) {}

  ngOnChanges(): void {
    this.tasksByTeam.set(
      this._reportChartService.getTasksByTeamMember(this.data)
    );
  }
}
