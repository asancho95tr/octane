import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { Row } from '@models/interfaces/row.model';
import { BaseTable } from '@models/interfaces/base-table.model';
import { DETAIL_HEADERS } from '@utils/static.data';
import { HeadersToCheck } from '@models/enums/headers-to-check.enum';
import { Header } from '@models/interfaces/header.model';
import { BaseItem } from '@models/interfaces/base-item.model';

type HeaderMap = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class ReportDetailService extends ReportBaseService {
  getDetails(data: Row[]): BaseTable {
    data.sort((a: Row, b: Row) => {
      const ownerA: string =
        a[HeadersToCheck.OWNER] ?? a[HeadersToCheck.ASSIGNED] ?? '';
      const ownerB: string =
        b[HeadersToCheck.OWNER] ?? b[HeadersToCheck.ASSIGNED] ?? '';
      return ownerA < ownerB ? -1 : 1;
    });
    const rows = this.#transformRows(
      data.map((element: Row) => {
        const efficiency = this.getEfficiency([element], true).efficiency;
        return {
          ...element,
          estimatedVsInvested: efficiency,
        };
      }),
      DETAIL_HEADERS
    );
    return {
      name: 'Detalles',
      headers: DETAIL_HEADERS,
      rows: rows,
    };
  }

  #transformRows<T extends Record<string, any>>(
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
        if (!transformedRow[newKey]?.text) {
          transformedRow[newKey] = { text: row[key] };
        } else {
          transformedRow[newKey] = row[key];
        }
      }

      return transformedRow;
    });
  }
}
