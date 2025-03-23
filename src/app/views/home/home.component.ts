import { NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { OctaneReport } from '@models/interfaces/octane-report.model';
import { ReportService } from '@services/report.service';
import { HomeBacklogComponent } from './components/backlog/backlog.component';
import { HomeProjectComponent } from './components/project/project.component';
import { HomeTeamComponent } from './components/team/team.component';
import { HomeDetailComponent } from './components/detail/detail.component';
import { BaseTable } from '@models/interfaces/base-table.model';
import { ReportDetailService } from '@services/report-detail.service';
import { BaseItem } from '@models/interfaces/base-item.model';
import { HomeTeamTasksComponent } from './components/team-tasks/team-tasks.component';
import { HomeBacklogChartsComponent } from './components/backlog-charts/backlog-charts.component';
import { HomeTeamFeaturesComponent } from './components/team-features/team-features.component';
import { HomeFeaturesSprintComponent } from './components/features-sprint/features-sprint.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterModule,
    NgIf,
    MatIcon,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    HomeBacklogComponent,
    HomeBacklogChartsComponent,
    HomeFeaturesSprintComponent,
    HomeProjectComponent,
    HomeTeamComponent,
    HomeTeamTasksComponent,
    HomeTeamFeaturesComponent,
    HomeDetailComponent,
  ],
})
export class HomeComponent {
  @ViewChild('fileImported') fileImported?: ElementRef;
  isImported = signal(false);
  showDetail = signal(false);
  report: WritableSignal<OctaneReport | undefined> = signal(undefined);
  detail: WritableSignal<BaseTable | undefined> = signal(undefined);
  constructor(
    private _reportService: ReportService,
    private _reportDetailService: ReportDetailService
  ) {}

  fileSelected(target: EventTarget | null) {
    this.showDetail.set(false);
    const file: File | undefined = (target as HTMLInputElement).files?.[0];
    if (file) {
      this._reportService.importReport(file).subscribe((report) => {
        this.report.set(report);
      });
      this.isImported.set(true);
    }
    if (this.fileImported) {
      this.fileImported.nativeElement.value = null;
    }
  }

  loadDetail(item: BaseItem, property: string) {
    this.showDetail.set(false);
    const rows = (item as any)[property].value;
    this.detail.set(this._reportDetailService.getDetails(rows ?? []));
    this.showDetail.set(true);
  }
}
