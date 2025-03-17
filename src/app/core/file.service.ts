import { Injectable } from '@angular/core';
import { Row } from '@models/interfaces/row.model';
import { from, map, Observable } from 'rxjs';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  uploadFileToJson(file: File): Observable<Row[]> {
    return from(file.arrayBuffer()).pipe(
      map((fileData: ArrayBuffer) => this.#getDataFromArrayBuffer(fileData))
    );
  }

  #getDataFromArrayBuffer(fileData: ArrayBuffer): Row[] {
    const workbook: WorkBook = read(fileData);
    const data: Row[] = [];
    const sheets = workbook.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const sheet: WorkSheet = workbook.Sheets[workbook.SheetNames[i]];
      const cellsWithHyperlinks: any[] = Object.keys(sheet)
        .map((cellName: string) => sheet[cellName])
        .filter((cell: any) => cell.l?.Target);
      const temp = utils.sheet_to_json(sheet);
      temp.forEach((res: any) => {
        data.push({ ...res, ...this.#getHyperLink(cellsWithHyperlinks, res) });
      });
    }
    return data;
  }

  #getHyperLink(cellsWithHyperlinks: any[], data: any) {
    const obj: any = {};
    Object.keys(data).forEach((key: string) => {
      const cell: any = cellsWithHyperlinks.find((c: any) => c.v === data[key]);
      if (cell?.l?.Target) {
        obj[`${key}_hyperlink`] = cell.l.Target.replaceAll('amp;', '');
      }
    });
    return obj;
  }
}
