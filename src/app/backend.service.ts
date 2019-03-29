import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { SecretsService } from "./secrets.service";

export const offlineOnly = false;

@Injectable({
  providedIn: "root"
})
export class BackendService {
  private parser = new Parser();

  constructor(
    private http: HttpClient,
    private secretsService: SecretsService
  ) {}

  public isOfflineOnly() {
    return offlineOnly;
  }

  // todo instead of making this silly get/getCached interface, use an observable(??)
  public getCached() {
    const cachedData = localStorage.getItem("bookworm/cached-data");
    if (cachedData) {
      const res = JSON.parse(cachedData);
      return this.parser.parse(res["values"] as string[][]);
    }
  }

  // todo add return type for this and other get methods
  public get() {
    if (offlineOnly) {
      return Promise.reject();
    }
    const API_KEY = this.secretsService.getApiKey();
    if (API_KEY) {
      const RANGE = "A1:G500";
      const SPREADSHEET_ID = this.secretsService.getSheetId();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      return this.http
        .get(url)
        .toPromise()
        .then(
          res => {
            localStorage.setItem("bookworm/cached-data", JSON.stringify(res));
            return this.parser.parse(res["values"] as string[][]);
          },
          err => {
            window.alert("Error fetching from db");
            return [];
          }
        );
    } else {
      return Promise.reject();
    }
  }

  // todo dedupe colors get code
  public getColorsCached() {
    const cachedData = localStorage.getItem("bookworm/cached-colors");
    if (cachedData) {
      const res = JSON.parse(cachedData);
      return this.parser.parseColors(res["values"] as string[][]);
    }
  }

  public getColors() {
    if (offlineOnly) {
      return Promise.reject();
    }
    const API_KEY = this.secretsService.getApiKey();
    if (API_KEY) {
      const RANGE = "Colors!A1:B500";
      const SPREADSHEET_ID = this.secretsService.getSheetId();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      return this.http
        .get(url)
        .toPromise()
        .then(
          res => {
            localStorage.setItem("bookworm/cached-colors", JSON.stringify(res));
            return this.parser.parseColors(res["values"] as string[][]);
          },
          err => {
            window.alert("Error fetching from db");
            return {};
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
  static headers = [
    "Timestamp",
    "What book?",
    "Start place (optional)",
    "End place",
    "Notes"
  ];
  createdAt: string; // When was the entry recorded?]
  book: string;
  start: string;
  end: string;
  notes: string;
}

class Parser {
  parse(rows: string[][]): Row[] {
    if (!this.headerEqualsExpected(rows)) {
      return null;
    }
    const ret = [];
    rows.slice(1).forEach(row => {
      ret.push(this.parseRow(row));
    });
    return ret;
  }
  parseRow(row: string[]): Row {
    const [A, B, C, D, E] = [0, 1, 2, 3, 4];

    const ret = new Row();
    ret.createdAt = row[A];
    ret.book = row[B];
    ret.start = row[C];
    ret.end = row[D];
    ret.notes = row[E];
    return ret;
  }

  // todo name this type
  parseColors(rows: string[][]): { [book: string]: string } {
    const ret = {};
    rows.forEach(([book, color]) => {
      if (color) {
        ret[book] = color;
      }
    });
    console.log(ret);
    return ret;
  }

  private headerEqualsExpected(rows: string[][]): boolean {
    // todo array comparison using lodash or something?
    return JSON.stringify(rows[0]) === JSON.stringify(Row.headers);
  }
}
