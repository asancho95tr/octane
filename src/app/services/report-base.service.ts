import { Injectable } from '@angular/core';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { ReportHeaders } from '@models/enums/report-headers.enum';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';
import { BaseItem } from '@models/interfaces/base-item.model';
import { Efficiency } from '@models/interfaces/efficiency.model';
import { Header } from '@models/interfaces/header.model';
import { Row } from '@models/interfaces/row.model';
import {
  CEREMONIES,
  EFICIENCY,
  ENDED_PHASES,
  RATIO_BUGS,
} from '@utils/config.data';

@Injectable({
  providedIn: 'root',
})
export class ReportBaseService {
  emptyItem: BaseItem = { text: ' - ', value: undefined };

  getValueByProperty(
    item: any,
    property: string,
    forceParent: boolean = false
  ) {
    if (forceParent) {
      return (
        item[`${HeadersToCheck.BACKLOG_ITEM}${property}`] ?? item[property]
      );
    }
    return item[property] ?? item[`${HeadersToCheck.BACKLOG_ITEM}${property}`];
  }

  getFeature(item: any) {
    return (
      this.getValueByProperty(item, HeadersToCheck.FEATURE) ??
      this.getValueByProperty(item, HeadersToCheck.PARENT)
    );
  }

  propertyExists(element: any, property: string) {
    const value = this.getValueByProperty(element, property);
    return value && value !== '';
  }

  getEfficiency(data: Row[], allowInProgress: boolean = false): Efficiency {
    const itemsToCheck = allowInProgress
      ? data
      : data.filter(
          (element: Row) =>
            ENDED_PHASES.includes(element[HeadersToCheck.PHASE]) ||
            ENDED_PHASES.includes(element[HeadersToCheck.STATUS])
        );
    const calcs = this.getCalcs(itemsToCheck, allowInProgress);
    const tasksWithoutSprint: Row[] = data.filter(
      (i: Row) =>
        !this.getValueByProperty(i, HeadersToCheck.SPRINT) ||
        this.getValueByProperty(i, HeadersToCheck.SPRINT) === ''
    );
    const countWithoutSprint: number = tasksWithoutSprint.length;
    return {
      efficiency: {
        text: calcs.efficiency,
        class: this.getClass(calcs.efficiency, ReportHeaders.EFFICIENCY),
      },
      doneOrClosed: { text: itemsToCheck.length, value: itemsToCheck },
      tasksWithoutSprint: {
        text: countWithoutSprint,
        value: tasksWithoutSprint,
      },
    };
  }

  getSummatory(items: Row[], property: SummatoryKeys): number {
    return items
      .map((element: Row) => element[property])
      .reduce((sum: number, current: number) => sum + current, 0);
  }

  getCalcs(data: Row[], allowInProgress: boolean = false) {
    const estimated: number = this.getSummatory(data, SummatoryKeys.ESTIMATED);
    const invested: number = this.getSummatory(data, SummatoryKeys.INVESTED);
    const remaining: number = this.getSummatory(data, SummatoryKeys.REMAINING);
    const efficiency: number =
      estimated > 0 && invested > 0
        ? estimated / (allowInProgress ? invested + remaining : invested)
        : 0;
    return {
      estimated: estimated,
      invested: invested,
      remaining: remaining,
      efficiency: efficiency,
    };
  }

  getOwner(element: Row) {
    if (this.propertyExists(element, HeadersToCheck.OWNER)) {
      return this.getValueByProperty(element, HeadersToCheck.OWNER);
    } else {
      return this.getValueByProperty(element, HeadersToCheck.ASSIGNED);
    }
  }

  getClass(value: number, column: string) {
    let classes: string = '';
    switch (column) {
      case ReportHeaders.NO_ESTIMATED:
      case ReportHeaders.WITH_REMAINING_HOURS:
      case ReportHeaders.NO_INVESTED:
      case ReportHeaders.OPENED:
      case ReportHeaders.NO_ASIGNED:
      case ReportHeaders.ESTIMATED_VS_INVESTED:
        classes = value > 0 ? 'need_work' : '';
        break;
      case ReportHeaders.BUGS:
        classes = value > RATIO_BUGS ? 'need_work' : '';
        break;
      case ReportHeaders.CEREMONIES:
        classes = value < CEREMONIES.length ? 'need_work' : '';
        break;
      case ReportHeaders.EFFICIENCY:
        classes =
          value * 100 < 100 - EFICIENCY || value * 100 > 100 + EFICIENCY
            ? 'need_work'
            : 'done';
        break;
      case ReportHeaders.DETECTED_DEFECTS:
        classes = value === 0 ? 'need_work' : 'done';
        break;
    }
    return `right ${classes}`;
  }

  transformRows<T extends Record<string, any>>(
    rows: T[],
    headers: Header[]
  ): Record<string, BaseItem>[] {
    // Crear un mapa de las cabeceras para facilitar la conversión
    const headerMap: HeaderMap = Object.fromEntries(
      headers.map((h) => [h.text, h.value])
    );

    return rows.map((row) => {
      const transformedRow: Record<string, BaseItem> = {};

      for (const key in row) {
        const newKey = headerMap[key] || key; // Si no hay mapeo, mantener la clave original
        if (!transformedRow[newKey] && row[key]?.text === undefined) {
          transformedRow[newKey] = { text: row[key] };
        } else {
          transformedRow[newKey] = row[key];
        }
      }

      return transformedRow;
    });
  }
}

type HeaderMap = Record<string, string>;
