import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private parser = new Parser();

  constructor(private http: HttpClient) { }

  public get() {
    const API_KEY=localStorage.getItem('bookworm/google-api-key');
    if (API_KEY) {
      const RANGE='A1:G500';
      const SPREADSHEET_ID='1dZGi9Vw5ReO3Lh2ebosuA6U0lxU71DqeavLuOudhMBI';
      const url=`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      return this.http.get(url).toPromise().then(
        res => this.parser.parse(res['values'] as string[][]),
        err => {
          window.alert('Error fetching from db');
          return [];
        }
      );
    } else {
      return Promise.reject();
    }
  }
}

export class Row {
  // Changing columns requires changes in three places:
  // - Row.headers
  // - Row's attributes
  // - Parser.parseRow
  static headers = ["Timestamp","What book?","Start place (optional)","End place","Notes"];
  createdAt: string;  // When was the entry recorded?]
  book: string;
  start: string;
  end: string;
  notes: string;
}

class Parser {
  

  parse(rows: string[][]): Row[] {
    if (! this.headerEqualsExpected(rows)) {
      return null;
    }
    const ret = [];
    rows.slice(1).forEach(row => {
      ret.push(this.parseRow(row));
    });
    return ret;
  }
  parseRow(row: string[]): Row {
    const [A,B,C,D,E] = [0,1,2,3,4];

    const ret = new Row();
    ret.createdAt = row[A];
    ret.book = row[B];
    ret.start = row[C];
    ret.end = row[D];
    ret.notes = row[E];
    return ret;
  }

  private headerEqualsExpected(rows: string[][]): boolean {
    // todo array comparison using lodash or something?
    return JSON.stringify(rows[0]) === JSON.stringify(Row.headers);
  }
}