import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HomeBaseComponent } from '../base.component';
import { DataPipe } from '@pipes/data.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { PieChartComponent } from '@components/charts/pie/pie.component';
import { ReportChartService } from '@services/report-chart.service';
import { PieChart } from '@shared/models/pie.interface';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { Row } from '@models/interfaces/row.model';
import { BaseItem } from '@models/interfaces/base-item.model';
import { TeamItemProperty } from '@models/interfaces/octane-report.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatTooltip,
    MatTableModule,
    DataPipe,
    PieChartComponent,
  ],
})
export class HomeTeamComponent extends HomeBaseComponent implements OnChanges {
  tasksByTeam: WritableSignal<PieChart | undefined> = signal(undefined);
  constructor(private _reportChartService: ReportChartService) {
    super();
  }

  ngOnChanges(): void {
    this.tasksByTeam.set(
      this._reportChartService.getTasksByTeamMember(this.data)
    );
  }
}
