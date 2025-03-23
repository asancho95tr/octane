import { Injectable } from '@angular/core';
import { Row } from '@models/interfaces/row.model';
import { REPORT_HEADERS } from '@utils/static.data';
import { ReportBaseService } from './report-base.service';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';
import {
  CEREMONIES,
  ENDED_PHASES,
  MIN_ESTIMATION_VS_INVESTED,
  NAME_BUG_TYPE,
} from '@utils/config.data';
import { BaseTable } from '@models/interfaces/base-table.model';
import { ReportHeaders } from '@models/enums/report-headers.enum';
import { Header } from '@models/interfaces/header.model';

@Injectable({
  providedIn: 'root',
})
export class ReportBacklogService extends ReportBaseService {
  backlogBySprints: Record<string, Row[]>[] = [];

  /**
   * Method to generate the backlog report for a set of sprints
   * @param data The data to generate the report
   * @param sprints The array of sprints to generate the report
   * @returns The backlog report
   */
  getBacklog(data: Row[], sprints: string[]): BaseTable {
    this.backlogBySprints = [];
    return {
      name: 'Tareas',
      headers: REPORT_HEADERS.filter((header: Header) => !header.hidden),
      rows: sprints.map((sprint: string) => {
        const itemsSprint: Row[] = this.#getItemsBySprint(data, sprint);
        const newObj: Record<string, Row[]> = {};
        newObj[sprint] = itemsSprint;
        this.backlogBySprints.push(newObj);
        //Cálculos
        const calcs = this.getCalcs(itemsSprint);
        //Datos
        const noEstimatedData: Row[] = itemsSprint.filter(
          this.#hasNoNoItemsOf(SummatoryKeys.ESTIMATED)
        );
        const withRemainingHoursData: Row[] = itemsSprint.filter(
          this.#hasItemsOf(SummatoryKeys.REMAINING)
        );
        const noInvestedData: Row[] = itemsSprint.filter(
          this.#hasNoNoItemsOf(SummatoryKeys.INVESTED)
        );

        const openedData: Row[] = this.#getOpenedData(itemsSprint);
        const noAsignedData: Row[] = this.#getNoAsignedData(itemsSprint);
        const estimatedVsInvested: Row[] =
          this.#getEstimatedVsInvested(itemsSprint);
        const bugs: Row[] = this.#getBugs(itemsSprint);
        const detectedDefects: Row[] = this.#getDetectedDefects(itemsSprint);
        const detectedDefectsCount: number = this.getSummatory(
          detectedDefects,
          SummatoryKeys.DETECTED_DEFECTS
        );
        const ceremonies: Row[] = this.#getCeremonies(itemsSprint);

        const team = [
          ...new Set(itemsSprint.map((element: Row) => this.getOwner(element))),
        ];
        const tasksByTeamMember = team.map((member: string) => {
          const tasks = itemsSprint.filter(
            (element: Row) => this.getOwner(element) === member
          );
          return tasks;
        });

        return {
          cycle: { text: itemsSprint[0][HeadersToCheck.CICLO] ?? '-' },
          sprint: { text: sprint },
          noEstimated: {
            text: noEstimatedData.length,
            value: noEstimatedData,
            class: this.getClass(
              noEstimatedData.length,
              ReportHeaders.NO_ESTIMATED
            ),
          },
          withRemaining: {
            text: withRemainingHoursData.length,
            value: withRemainingHoursData,
            class: this.getClass(
              withRemainingHoursData.length,
              ReportHeaders.WITH_REMAINING_HOURS
            ),
          },
          noInvested: {
            text: noInvestedData.length,
            value: noInvestedData,
            class: this.getClass(
              noInvestedData.length,
              ReportHeaders.NO_INVESTED
            ),
          },
          opened: {
            text: openedData.length,
            value: openedData,
            class: this.getClass(openedData.length, ReportHeaders.OPENED),
          },
          noAsigned: {
            text: noAsignedData.length,
            value: noAsignedData,
            class: this.getClass(
              noAsignedData.length,
              ReportHeaders.NO_ASIGNED
            ),
          },
          suspiciousInvestement: {
            text: estimatedVsInvested.length,
            value: estimatedVsInvested,
            class: this.getClass(
              estimatedVsInvested.length,
              ReportHeaders.ESTIMATED_VS_INVESTED
            ),
          },
          bugs: {
            text: bugs.length,
            value: bugs,
            class: this.getClass(bugs.length, ReportHeaders.BUGS),
          },
          defects: {
            text: detectedDefectsCount,
            value: detectedDefects,
            class: this.getClass(
              detectedDefectsCount,
              ReportHeaders.DETECTED_DEFECTS
            ),
          },
          ceremonies: {
            text: ceremonies.length,
            value: ceremonies,
            class: this.getClass(ceremonies.length, ReportHeaders.CEREMONIES),
          },
          estimatedVsInvested: {
            text: calcs.efficiency,
            class: this.getClass(calcs.efficiency, ReportHeaders.EFFICIENCY),
          },
          teamSize: {
            text: team.length,
            value: tasksByTeamMember.flat(),
            class: 'right',
          },
        };
      }),
    };
  }

  /**
   * Filters and maps data to include only items that belong to a specified sprint.
   * This function searches for elements in the data array where the sprint
   * property matches the given sprint argument and enriches each element with
   * additional computed properties like 'Estimado vs incurrido' and 'Feature'.
   *
   * @param data - An array of Row objects to filter and map.
   * @param sprint - The sprint identifier used to filter the items.
   * @returns An array of Row objects belonging to the specified sprint, each
   * enriched with additional properties.
   */

  #getItemsBySprint(data: Row[], sprint: string): Row[] {
    return data
      .filter(
        (element: Row) =>
          this.getValueByProperty(element, HeadersToCheck.SPRINT) === sprint
      )
      .map((element: Row) => {
        return {
          ...element,
          'Estimado vs incurrido': this.getEfficiency([element], true)
            .efficiency,
          Feature: this.getFeature(element),
        };
      });
  }

  /**
   * Determines if the specified property of a Row element has a value of zero.
   *
   * This function returns a predicate function that checks whether the given
   * property of a Row element equals zero.
   *
   * @param property - The key of the property to check in the Row element.
   * @returns A predicate function that returns true if the property's value is zero, otherwise false.
   */

  #hasNoNoItemsOf(property: SummatoryKeys) {
    return (element: Row) => this.getValueByProperty(element, property) === 0;
  }

  /**
   * Determines if the specified property of a Row element is non-zero.
   *
   * This function returns a predicate function that checks whether the given
   * property of a Row element does not equal zero.
   *
   * @param property - The key of the property to check in the Row element.
   * @returns A predicate function that returns true if the property's value is non-zero, otherwise false.
   */

  #hasItemsOf(property: SummatoryKeys) {
    return (element: Row) => this.getValueByProperty(element, property) !== 0;
  }

  /**
   * Filters out items in a sprint that are already closed.
   *
   * This function takes an array of Row objects and filters out the ones
   * where 'Phase' or 'Status' is in the ENDED_PHASES array.
   *
   * @param itemsSprint - An array of Row objects to filter.
   * @returns An array of Row objects that are not yet closed.
   */
  #getOpenedData(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter(
      (element: Row) =>
        !ENDED_PHASES.includes(
          this.getValueByProperty(element, HeadersToCheck.PHASE)
        ) &&
        !ENDED_PHASES.includes(
          this.getValueByProperty(element, HeadersToCheck.STATUS)
        )
    );
  }

  /**
   * Filters out items in a sprint that do not have an owner or assigned member.
   *
   * This function takes an array of Row objects and filters out the ones
   * where there is no value for 'Owner' or 'Assigned'.
   *
   * @param itemsSprint - An array of Row objects to filter.
   * @returns An array of Row objects that do not have an owner or assigned member.
   */
  #getNoAsignedData(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter(
      (element: any) =>
        !this.propertyExists(element, HeadersToCheck.OWNER) &&
        !this.propertyExists(element, HeadersToCheck.ASSIGNED)
    );
  }

  /**
   * Filters out items in a sprint that have an estimated time equal to the invested time
   * and both are greater than or equal to the minimum estimation vs invested threshold.
   *
   * This function takes an array of Row objects and filters out the ones
   * where 'Estimated' is equal to 'Invested' and both are greater than or equal to
   * the MIN_ESTIMATION_VS_INVESTED threshold.
   *
   * @param itemsSprint - An array of Row objects to filter.
   * @returns An array of Row objects where 'Estimated' is equal to 'Invested'
   * and both are greater than or equal to the MIN_ESTIMATION_VS_INVESTED threshold.
   */
  #getEstimatedVsInvested(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter((element: Row) => {
      const estimated = this.getValueByProperty(
        element,
        HeadersToCheck.ESTIMATED
      );
      const invested = this.getValueByProperty(
        element,
        HeadersToCheck.INVESTED
      );
      return estimated === invested && estimated >= MIN_ESTIMATION_VS_INVESTED;
    });
  }

  /**
   * Filters out items in a sprint that are of type bug.
   *
   * This function takes an array of Row objects and filters out the ones
   * where the 'Type' property matches the NAME_BUG_TYPE value.
   *
   * @param itemsSprint - An array of Row objects to filter.
   * @returns An array of Row objects that are of type bug.
   */
  #getBugs(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter(
      (element: Row) =>
        this.getValueByProperty(element, HeadersToCheck.TYPE, true) ===
        NAME_BUG_TYPE
    );
  }

  /**
   * Filters out items in a sprint that have a detected defects value.
   *
   * This function takes an array of Row objects and filters out the ones
   * where the 'Detected Defects' property exists.
   *
   * @param itemsSprint - An array of Row objects to filter.
   * @returns An array of Row objects that have a detected defects value.
   */
  #getDetectedDefects(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter((element: Row) =>
      this.propertyExists(element, HeadersToCheck.DETECTED_DEFECTS)
    );
  }

  /**
   * Filters out items in a sprint that are categorized as ceremonies.
   *
   * This function takes an array of Row objects and returns those
   * whose 'Name' property is included in the predefined list of ceremonies.
   *
   * @param itemsSprint - An array of Row objects to filter.
   * @returns An array of Row objects that are categorized as ceremonies.
   */

  #getCeremonies(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter((element: Row) =>
      CEREMONIES.includes(
        this.getValueByProperty(element, HeadersToCheck.NAME, true)
      )
    );
  }
}
