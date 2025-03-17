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
import { RouterModule } from '@angular/router';
import { OctaneReport } from '@models/interfaces/octane-report.model';
import { ReportService } from '@services/report.service';
import { HomeBacklogComponent } from './components/backlog/backlog.component';
import { HomeProjectComponent } from './components/project/project.component';
import { HomeTeamComponent } from './components/team/team.component';
import { HomeDetailComponent } from './components/detail/detail.component';
import { BaseTable } from '@models/interfaces/base-table.model';
import { Row } from '@models/interfaces/row.model';
import { ReportDetailService } from '@services/report-detail.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterModule,
    NgIf,
    MatIcon,
    MatButton,
    HomeBacklogComponent,
    HomeProjectComponent,
    HomeTeamComponent,
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

  loadDetail(event: { item: Row; property: string }) {
    const item = event.item;
    const property = event.property;
    const rows = (item as any)[property].value;
    this.detail.set(this._reportDetailService.getDetails(rows));
    this.showDetail.set(true);
  }
}
