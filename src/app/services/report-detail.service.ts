import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { Row } from '@models/interfaces/row.model';
import { BaseTable } from '@models/interfaces/base-table.model';
import { DETAIL_HEADERS } from '@utils/static.data';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { Header } from '@models/interfaces/header.model';

@Injectable({
  providedIn: 'root',
})
export class ReportDetailService extends ReportBaseService {
  /**
   * Transforma la lista de tareas en una tabla con la columna adicional
   * 'estimatedVsInvested' que contiene la eficiencia de cada tarea.
   * @param data lista de tareas
   * @returns tabla con la columna adicional 'estimatedVsInvested'
   */
  getDetails(data: Row[]): BaseTable {
    data.sort((a: Row, b: Row) => {
      const ownerA: string =
        a[HeadersToCheck.OWNER] ?? a[HeadersToCheck.ASSIGNED] ?? '';
      const ownerB: string =
        b[HeadersToCheck.OWNER] ?? b[HeadersToCheck.ASSIGNED] ?? '';
      return ownerA < ownerB ? -1 : 1;
    });
    const rows = this.transformRows(
      data.map((element: Row) => {
        return {
          ...element,
          Feature: this.getFeature(element),
          estimatedVsInvested: this.getEfficiency([element], true).efficiency,
        };
      }),
      DETAIL_HEADERS
    );
    return {
      name: 'Detalles',
      headers: DETAIL_HEADERS.filter(
        (header: Header) =>
          !header.hidden && this.checkIfCanShowEfficiency(header.value)
      ),
      rows: rows,
    };
  }
}
