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

  /**
   * Method to import a Octane report from a json file.
   *
   * Reads a file, parses it as a json and returns an OctaneReport with the backlog, project and team efficiency.
   *
   * @param file The file to be imported.
   * @returns An Observable of OctaneReport.
   */
  importReport(file: File): Observable<OctaneReport> {
    return this._fileService
      .uploadFileToJson(file)
      .pipe(map((data) => this.#formatData(data)));
  }

  /**
   * Method to format the data of a report.
   *
   * Returns an OctaneReport with the backlog, project and team efficiency.
   *
   * @param data The data to be formatted.
   * @returns An OctaneReport with the backlog, project and team efficiency.
   */
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

  /**
   * Method to get all the sprints from a dataset.
   *
   * Filters the dataset to only include the elements that have a sprint and then
   * maps them to get the sprint value. The result is an array of unique string
   * values.
   *
   * @param data The dataset to be processed.
   * @returns An array of unique string values representing the sprints.
   */
  #getSprints(data: Row[]) {
    return [
      ...new Set(
        data
          .filter((i: Row) => this.#getSprintValue(i) !== undefined)
          .map((item: Row) => this.#getSprintValue(item)) as string[]
      ),
    ];
  }

  /**
   * Retrieves the sprint value from a given row item.
   *
   * Attempts to get the sprint value using the SPRINT header. If not available,
   * it tries to fetch the sprint value using the BACKLOG_ITEM and SPRINT headers combined.
   *
   * @param item The row item from which to extract the sprint value.
   * @returns The sprint value if available, otherwise undefined.
   */

  #getSprintValue(item: Row) {
    return (
      this.getValueByProperty(item, HeadersToCheck.SPRINT) ??
      this.getValueByProperty(
        item,
        HeadersToCheck.BACKLOG_ITEM + HeadersToCheck.SPRINT
      )
    );
  }

  /**
   * Method to sort an array of sprint names.
   *
   * It will sort the array by the numerical value of the sprint name.
   * If the sprint name does not contain a numerical value, it will be
   * placed last in the sorting.
   *
   * @returns A compare function for an array sort.
   */
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
