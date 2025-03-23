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

  /**
   * Handles the file selection event, importing the selected file as a report.
   * It resets the detail view, checks if a file is selected, and then imports
   * the report using the ReportService. If successful, updates the report signal
   * and marks the file as imported. Resets the file input element after processing.
   *
   * @param target - The event target from which the file is selected.
   */

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

  /**
   * Initiates the download of a template Excel file. Creates a hidden anchor
   * element, sets the href to the template file location, specifies the
   * download attribute for the file name, and programmatically clicks the
   * anchor to trigger the download. Removes the anchor element from the
   * document after the download is initiated.
   */

  downloadTemplate() {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/templates/template.xlsx';
    link.download = 'template.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  /**
   * Loads the detail table with the rows associated to the given BaseItem
   * property. It resets the detail view, gets the rows from the given property,
   * asks the ReportDetailService to get the details, and updates the detail
   * signal. Finally, it shows the detail view.
   *
   * @param item - The BaseItem from which to get the rows.
   * @param property - The property of the BaseItem from which to get the rows.
   */
  loadDetail(item: BaseItem, property: string) {
    this.showDetail.set(false);
    const rows = (item as any)[property].value;
    this.detail.set(this._reportDetailService.getDetails(rows ?? []));
    this.showDetail.set(true);
  }

  /**
   * Closes the detail view by setting the showDetail signal to false and the
   * detail signal to undefined.
   */
  closeDetail() {
    this.showDetail.set(false);
    this.detail.set(undefined);
  }
}
