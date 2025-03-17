import { Injectable } from '@angular/core';
import { FileService } from '@core/file.service';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { OctaneReport } from '@models/interfaces/octane-report.model';
import { Row } from '@models/interfaces/row.model';
import { map, Observable } from 'rxjs';
import { ReportBaseService } from './report-base.service';
import { ReportBacklogService } from './report-backlog.service';
import { ReportProjectService } from './report-project.service';
import { ReportTeamService } from './report-team.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends ReportBaseService {
  constructor(
    private _fileService: FileService,
    private _reportBacklogService: ReportBacklogService,
    private _reportProjectService: ReportProjectService,
    private _reportTeamService: ReportTeamService
  ) {
    super();
  }

  importReport(file: File): Observable<OctaneReport> {
    return this._fileService
      .uploadFileToJson(file)
      .pipe(map((data) => this.#formatData(data)));
  }

  #formatData(data: Row[]): OctaneReport {
    const sprints: string[] = this.#getSprints(data);
    sprints.sort(this.#sortSprints());
    const dataWithEfficiency: Row[] = data.map((item: Row) => {
      return {
        ...item,
        estimatedVsInvested: this.getEfficiency([item], true).efficiency,
      };
    });
    return {
      backlog: this._reportBacklogService.getBacklog(data, sprints),
      team: this._reportTeamService.getTeamEfficiency(dataWithEfficiency),
      project:
        this._reportProjectService.getProjectEfficiency(dataWithEfficiency),
    };
  }

  #getSprints(data: Row[]) {
    return [
      ...new Set(
        data
          .filter((i: Row) => this.#getSprintValue(i) !== undefined)
          .map((item: Row) => this.#getSprintValue(item)) as string[]
      ),
    ];
  }

  #getSprintValue(item: Row) {
    return (
      this.getValueByProperty(item, HeadersToCheck.SPRINT) ??
      this.getValueByProperty(
        item,
        HeadersToCheck.BACKLOG_ITEM + HeadersToCheck.SPRINT
      )
    );
  }

  #sortSprints() {
    return (a: string, b: string) =>
      Number(
        a
          .replace(HeadersToCheck.SPRINT, '')
          .replace(HeadersToCheck.BACKLOG_ITEM, '')
      ) -
      Number(
        b
          .replace(HeadersToCheck.SPRINT, '')
          .replace(HeadersToCheck.BACKLOG_ITEM, '')
      );
  }
}
