import { Injectable } from '@angular/core';
import { Row } from '@models/interfaces/row.model';
import { from, map, Observable } from 'rxjs';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /**
   * Uploads a file to the server and parses it as a json.
   *
   * It returns an observable of an array of Row objects.
   *
   * @param file The file to be uploaded.
   * @returns An observable of an array of Row objects.
   */
  uploadFileToJson(file: File): Observable<Row[]> {
    return from(file.arrayBuffer()).pipe(
      map((fileData: ArrayBuffer) => this.#getDataFromArrayBuffer(fileData))
    );
  }

  /**
   * Parses the provided ArrayBuffer into an array of Row objects.
   *
   * This method reads the binary data of a workbook from an ArrayBuffer,
   * processes each sheet, and converts it into JSON format. It also
   * extracts any hyperlinks present in the sheet and appends them to
   * the corresponding data entries.
   *
   * @param fileData The ArrayBuffer representing the workbook data.
   * @returns An array of Row objects containing the parsed data from the workbook.
   */

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

  /**
   * Iterates over the provided data and checks if there is a cell with a hyperlink
   * in the cellsWithHyperlinks array that matches the value of the key in the data.
   * If a match is found, it adds an entry to the returned object with the key
   * being the original key with '_hyperlink' appended to it and the value being
   * the URL of the hyperlink with all 'amp;' strings removed.
   *
   * @param cellsWithHyperlinks The array of cells with hyperlinks.
   * @param data The data to check for hyperlinks.
   * @returns An object with the hyperlinks found in the data.
   */
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
