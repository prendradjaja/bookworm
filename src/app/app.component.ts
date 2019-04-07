import { Component, OnInit, HostListener } from "@angular/core";
import { BackendService, Row } from "./backend.service";
import { ColorService } from "./color.service";
import { SecretsService } from "./secrets.service";
import * as moment from "moment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  rows: Row[] = [];
  newEntryUrl: string;

  exampleRowFull: Row;

  loading = true;

  fabColor: string = "gray";
  fabUrl: string;

  sheetUrl: string;

  currentDateFilter: Date;

  private lastRow: Row;
  // Only fetched once. Copy, don't mutate.
  allRows: Row[];

  constructor(
    public backendService: BackendService,
    private colorService: ColorService,
    private secretsService: SecretsService
  ) {}

  ngOnInit() {
    this.newEntryUrl = `https://docs.google.com/forms/d/e/${this.secretsService.getFormId()}/viewform`;
    this.fabUrl = this.newEntryUrl;
    const sheetId = this.secretsService.getSheetId();
    this.sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

    const cached = this.backendService.getCached();
    if (cached) {
      this.onRowsReceived(cached);
    }

    this.backendService.get().then(
      allRows => {
        this.loading = false;
        this.onRowsReceived(allRows);
      },
      err => {
        // if (!this.backendService.isOfflineOnly()) {
        //   this.loading = false; // lol isn't this duplication what .finally is for?
        //   const key = window.prompt("Set key (leave blank for no action)");
        //   if (key) {
        //     localStorage.setItem("bookworm/google-api-key", key);
        //     location.reload();
        //   }
        // }
      }
    );
  }

  private onRowsReceived(allRows: Row[]) {
    this.lastRow = allRows[allRows.length - 1];
    this.allRows = allRows;
    this.reset();
  }

  public filterByBook(book: string) {
    this.reset();
    this.rows = this.rows.filter(x => x.book === book);
    this.updateFabColor();
  }

  public filterByDate(d: Date) {
    this.reset();
    this.currentDateFilter = d;
    this.rows = this.rows.filter(x => stos(x.createdAt) === dtos(d));
    console.log(this.fabColor);
    this.updateFabColor();
    console.log(this.fabColor);
  }

  // todo rename
  private updateFabColor() {
    // When not filtering, use the first book
    // When filtering by book, use the book you're filtering by (which, of course, will also be the first book)
    // When filtering by date, use the most recent entry's book (which, again, will of course be the first book)
    // TODO: If you try to prefill with an invalid book name, it just doesn't choose a book. Maybe prefill the "other" instead? How could I accomplish that?

    if (this.rows.length === 0 || !this.rows[0].book) {
      this.fabColor = null;
      return;
    }

    const book = this.rows[0].book;
    // todo is there a real way of doing this?
    const urlEncodedBook = book.replace(/ /g, "+");
    this.fabColor = this.colorService.getColor(book);
    const questionId = this.secretsService.getFormBookQuestionId();
    let url = `?usp=pp_url&entry.${questionId}=__other_option__&entry.${questionId}.other_option_response=${urlEncodedBook}`;
    this.fabUrl = this.newEntryUrl + url;
  }

  public reset() {
    this.currentDateFilter = null;
    this.rows = this.allRows.slice();
    // .slice(allRows.length - 5)
    // .filter(isNonEmpty)
    this.rows.sort(rowComparator);
    this.updateFabColor();
  }

  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    const C = 99;
    if (event.keyCode === C) {
      window.location.href = this.fabUrl;
    }
  }
}

// function isNonEmpty(row: Row): boolean {
//   return [row.when, row.who, row.what, row.notes, row.other].some(x => !!x);
// }

function toTimestamp(d: string): number {
  return new Date(d).getTime();
}

/**
 * Assuming x !== y
 */
function compare(x, y) {
  if (x < y) {
    return 1;
  } else {
    // x > y because of x !== y
    return -1;
  }
}

/**
 * Todo: Why does this seem to work correctly for things missing .when entirely (instead of just having .when equal to each other) even though I didn't write anything special for that?
 */
function rowComparator(a: Row, b: Row): number {
  const aDate = toTimestamp(a.createdAt);
  const bDate = toTimestamp(b.createdAt);

  // I'm potentially breaking the x !== y rule, but timestamps should never be equal anyway...
  return compare(aDate, bDate);
}

// todo dedupe these
// todo real tz handling?
function dtos(d: moment.Moment) {
  return d.format("M/D/Y");
}

// takes dates like 1/19/2019 22:49:46
function stod(s: string): moment.Moment {
  const dateWithoutTime = s.split(" ")[0];
  return moment(dateWithoutTime);
}

// e.g. 1/19/2019 22:49:46 -> 1/19/2019
function stos(s: string) {
  return dtos(stod(s));
}

// more stuff goes here
