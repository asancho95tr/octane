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
  getBacklog(data: Row[], sprints: string[]): BaseTable {
    this.backlogBySprints = [];
    return {
      name: 'Tareas',
      headers: REPORT_HEADERS.filter((header: Header) => !header.hidden),
      rows: sprints.map((sprint: string) => {
        const itemsSprint: Row[] = this.#getItemsBySprint(data, sprint);
        let newObj: Record<string, Row[]> = {};
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
        };
      }),
    };
  }

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

  #hasNoNoItemsOf(property: SummatoryKeys) {
    return (element: Row) => this.getValueByProperty(element, property) === 0;
  }

  #hasItemsOf(property: SummatoryKeys) {
    return (element: Row) => this.getValueByProperty(element, property) !== 0;
  }

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

  #getNoAsignedData(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter(
      (element: any) =>
        !this.propertyExists(element, HeadersToCheck.OWNER) &&
        !this.propertyExists(element, HeadersToCheck.ASSIGNED)
    );
  }

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

  #getBugs(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter(
      (element: Row) =>
        this.getValueByProperty(element, HeadersToCheck.TYPE, true) ===
        NAME_BUG_TYPE
    );
  }

  #getDetectedDefects(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter((element: Row) =>
      this.propertyExists(element, HeadersToCheck.DETECTED_DEFECTS)
    );
  }

  #getCeremonies(itemsSprint: Row[]): Row[] {
    return itemsSprint.filter((element: Row) =>
      CEREMONIES.includes(
        this.getValueByProperty(element, HeadersToCheck.NAME, true)
      )
    );
  }
}
