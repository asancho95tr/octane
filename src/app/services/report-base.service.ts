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

  /**
   * Return the value of a property in a given item.
   *
   * If the `forceParent` flag is set to `true`, the function will first try to
   * find the value in a property with the prefix `${HeadersToCheck.BACKLOG_ITEM}`,
   * and if not found, it will try to find the value in a property with the given
   * name.
   *
   * If the `forceParent` flag is set to `false` or not provided, the function
   * will first try to find the value in a property with the given name, and if
   * not found, it will try to find the value in a property with the prefix
   * `${HeadersToCheck.BACKLOG_ITEM}`.
   *
   * @param item The item to search the property in.
   * @param property The name of the property to search for.
   * @param forceParent Whether to force the search in a property with the
   * prefix `${HeadersToCheck.BACKLOG_ITEM}`. Defaults to `false`.
   * @returns The value of the property if found, `undefined` otherwise.
   */
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

  /**
   * Retrieves the feature value from the specified item.
   *
   * The method first attempts to obtain the feature value using the
   * `HeadersToCheck.FEATURE` key. If the feature value is not found,
   * it attempts to retrieve the value using the `HeadersToCheck.PARENT` key.
   *
   * @param item The item from which to extract the feature value.
   * @returns The feature value, or `undefined` if not found.
   */

  getFeature(item: any) {
    return (
      this.getValueByProperty(item, HeadersToCheck.FEATURE) ??
      this.getValueByProperty(item, HeadersToCheck.PARENT)
    );
  }

  /**
   * Checks if the given element has a value for the given property.
   *
   * The method first attempts to retrieve the value using the
   * `getValueByProperty` method. If the value is not `undefined` and is not
   * an empty string, the method returns `true`. Otherwise, it returns `false`.
   *
   * @param element The element to search the property in.
   * @param property The name of the property to search for.
   * @returns Whether the element has a value for the given property.
   */
  propertyExists(element: any, property: string) {
    const value = this.getValueByProperty(element, property);
    return value && value !== '';
  }

  /**
   * Retrieves the efficiency values for the given data.
   *
   * The method first filters the data to only include items that have a
   * phase or status that is in the `ENDED_PHASES` array. If `allowInProgress`
   * is set to `true`, the method will not filter the data and will include
   * all items.
   *
   * The method then calculates the efficiency values using the `getCalcs`
   * method and returns an object with the following properties:
   *  - `efficiency`: The calculated efficiency value.
   *  - `doneOrClosed`: The number of items that are done or closed.
   *  - `tasksWithoutSprint`: The number of items that do not have a sprint
   *    defined.
   *
   * @param data The data to calculate the efficiency for.
   * @param allowInProgress Whether to allow items that are in progress.
   * @returns An object with the calculated efficiency values.
   */
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

  /**
   * Returns the sum of the given property across all items in the given array.
   *
   * The method first maps each item in the array to the value of the given
   * property. It then reduces the array of values to a single sum.
   *
   * @param items The array of items to sum the property values for.
   * @param property The property to sum the values for.
   * @returns The sum of the property values.
   */
  getSummatory(items: Row[], property: SummatoryKeys): number {
    return items
      .map((element: Row) => element[property])
      .reduce((sum: number, current: number) => sum + current, 0);
  }

  /**
   * Calculates and returns the estimated, invested, remaining hours, and the efficiency
   * for the given data.
   *
   * The method sums up the estimated, invested, and remaining hours from the data
   * using the `getSummatory` method. The efficiency is calculated as the ratio of
   * estimated hours to invested hours. If `allowInProgress` is true, the remaining
   * hours are added to the invested hours in the efficiency calculation.
   *
   * @param data The array of rows to calculate the values for.
   * @param allowInProgress Whether to include in-progress items in the calculation.
   * @returns An object containing the estimated, invested, remaining hours, and efficiency.
   */

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

  /**
   * Retrieves the owner value for the given element.
   *
   * The method first attempts to retrieve the owner value using the
   * `HeadersToCheck.OWNER` key. If the owner value is not found,
   * it attempts to retrieve the value using the `HeadersToCheck.ASSIGNED` key.
   *
   * @param element The element to search the owner in.
   * @returns The owner value, or `undefined` if not found.
   */
  getOwner(element: Row) {
    if (this.propertyExists(element, HeadersToCheck.OWNER)) {
      return this.getValueByProperty(element, HeadersToCheck.OWNER);
    } else {
      return this.getValueByProperty(element, HeadersToCheck.ASSIGNED);
    }
  }

  /**
   * Returns true if the given element is in a closed phase or status.
   *
   * @param element The element to check.
   * @returns True if the element is closed, false otherwise.
   */
  getClosedData(element: Row) {
    return (
      ENDED_PHASES.includes(
        this.getValueByProperty(element, HeadersToCheck.PHASE)
      ) ||
      ENDED_PHASES.includes(
        this.getValueByProperty(element, HeadersToCheck.STATUS)
      )
    );
  }

  /**
   * Gets the CSS class for the given value and column.
   *
   * The method applies different rules for different columns. For columns
   * `NO_ESTIMATED`, `WITH_REMAINING_HOURS`, `NO_INVESTED`, `OPENED`,
   * `NO_ASIGNED`, and `ESTIMATED_VS_INVESTED`, it applies the class `need_work`
   * if the value is greater than 0.
   *
   * For the column `BUGS`, it applies the class `need_work` if the value is
   * greater than the configured `RATIO_BUGS`.
   *
   * For the column `CEREMONIES`, it applies the class `need_work` if the value
   * is less than the length of the configured `CEREMONIES`.
   *
   * For the column `EFFICIENCY`, it applies the class `need_work` if the value
   * is less than 100 minus the configured `EFICIENCY`, or if the value is
   * greater than 100 plus the configured `EFICIENCY`. Otherwise, it applies the
   * class `done`.
   *
   * For the column `DETECTED_DEFECTS`, it applies the class `need_work` if the
   * value is 0, or the class `done` otherwise.
   *
   * @param value The value to check.
   * @param column The column to check.
   * @returns The CSS class for the given value and column.
   */
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

  /**
   * Given a set of data and a set of features, returns an array of objects
   * with the feature name and the number of tasks in that feature.
   *
   * @param data The data to filter.
   * @param features The set of features to filter by.
   * @returns An array of objects with the feature name and the number of tasks.
   */
  getTasksByFeature(data: Row[], feature: string) {
    return data.filter(
      (element: Row) =>
        this.getFeature(element) === feature && this.getClosedData(element)
    );
  }

  /**
   * Transform an array of rows into an array of objects where each key is the
   * header value and the value is an object with a `text` property. If the
   * header value is not found in the row, the key is the original key from the
   * row and the value is the original value from the row.
   *
   * The method first creates a map of the headers to facilitate the conversion.
   * Then it iterates over the rows and for each key in the row, it checks if
   * the key exists in the header map. If it does, it uses the value from the
   * map as the key. If not, it uses the original key from the row. If the value
   * in the row is an object with a `text` property, it uses that value. If not,
   * it creates an object with a `text` property and the value from the row.
   *
   * @param rows The array of rows to transform.
   * @param headers The array of headers to use for the transformation.
   * @returns An array of objects where each key is the header value and the
   * value is an object with a `text` property.
   */
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
