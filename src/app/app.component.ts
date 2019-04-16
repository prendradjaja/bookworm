import { Component, OnInit } from "@angular/core";
import { BackendService, Row } from "./backend.service";
import { ColorService } from "./color.service";
import { fromEvent, Observable, Observer, of, zip } from "rxjs";
import { map } from "rxjs/operators";

const NEW_ENTRY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfX-UsUXwOIqffaAGltLCECpal_O4IMSe5tLBUzda2P7DKoDQ/viewform";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  rows: Row[] = [];
  newEntryUrl = NEW_ENTRY_URL;

  exampleRowFull: Row;

  loading = true;

  fabColor: string = "gray";
  fabUrl: string = NEW_ENTRY_URL;

  currentDateFilter: Date;

  private lastRow: Row;
  // Only fetched once. Copy, don't mutate.
  allRows: Row[];

  constructor(
    private backendService: BackendService,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    observableFun();
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
        this.loading = false; // lol isn't this duplication what .finally is for?
        const key = window.prompt("Set key (leave blank for no action)");
        if (key) {
          localStorage.setItem("bookworm/google-api-key", key);
          location.reload();
        }
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
    // When filtering, use the book you're filtering by (which, of course, will also be the first book)
    // TODO: If you try to prefill with an invalid book name, it just doesn't choose a book. Maybe prefill the "other" instead? How could I accomplish that?

    if (this.rows.length === 0 || !this.rows[0].book) {
      this.fabColor = null;
      return;
    }

    const book = this.rows[0].book;
    // todo is there a real way of doing this?
    const urlEncodedBook = book.replace(/ /g, "+");
    this.fabColor = this.colorService.getColor(book);
    let url =
      "https://docs.google.com/forms/d/e/1FAIpQLSfX-UsUXwOIqffaAGltLCECpal_O4IMSe5tLBUzda2P7DKoDQ/viewform?usp=pp_url&entry.688353874=__other_option__&entry.688353874.other_option_response=" +
      // let url = ('https://docs.google.com/forms/d/e/1FAIpQLSfX-UsUXwOIqffaAGltLCECpal_O4IMSe5tLBUzda2P7DKoDQ/viewform?usp=pp_url&entry.688353874='
      urlEncodedBook;
    this.fabUrl = url;
  }

  public reset() {
    this.currentDateFilter = null;
    this.rows = this.allRows.slice();
    // .slice(allRows.length - 5)
    // .filter(isNonEmpty)
    this.rows.sort(rowComparator);
    this.updateFabColor();
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
// todo real tz handling? moment?
function dtos(d: Date) {
  // return d.toISOString().split('T')[0];
  const Y = d.getFullYear();
  const M = d.getMonth() + 1;
  const D = d.getDate();
  return `${M}/${D}/${Y}`;
}

function stod(s: string) {
  const temp = new Date(s);
  // todo discard time portion? how does this work with tzs?
  return temp;
}

function stos(s: string) {
  return dtos(stod(s));
}

// more stuff goes here
/*










*/

function observableFun() {
  // thisIsAnObservable();
  // creatingMyOwnObservables();
  tryingZip();
}

function thisIsAnObservable() {
  const link = document.querySelector("h1 a");

  // so this is an observable. try clicking on "Bookworm" at the top!
  const x: Observable<Event> = fromEvent(link, "click");
  x.subscribe(() => console.log("clicked"));

  // Q. why is it that this is allowed? i thought you needed a Subject in order to multicast to many Observers?
  // or i guess the .subscribe is not an Observer?
  x.subscribe(() => console.log("second click handler?"));
}

function creatingMyOwnObservables() {
  // Q. Observer.next... why is it called Observer? seems like it's the thing being observed, not the thing being observed

  // There's no difference between Observable.create and new Observable
  // https://stackoverflow.com/questions/45912735/difference-between-new-observable-and-rx-observable-create
  const y: Observable<number> = Observable.create(o => {
    o.next(1);
    o.next(2);
  });
  const z: Observable<number> = new Observable(subscriber => {
    // Q. Why is this called a subscriber?
    subscriber.next(3);
    subscriber.next(4);
  });

  y.subscribe(e => {
    console.log(e);
  });
  z.subscribe(e => {
    console.log(e);
  });
}

function tryingZip() {
  const x = of("x");
  const y = of("y");
  const xx = x.pipe(map(e => e + e));
  zip.apply(null, [xx, y]).subscribe(result => console.log(result));
}
