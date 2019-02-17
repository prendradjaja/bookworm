import { Component, OnInit } from '@angular/core';
import { BackendService, Row } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  rows: Row[] = [];
  newEntryUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfX-UsUXwOIqffaAGltLCECpal_O4IMSe5tLBUzda2P7DKoDQ/viewform';

  exampleRowFull: Row;

  private lastRow: Row;
  // Only fetched once. Copy, don't mutate.
  private allRows: Row[];

  constructor (private backendService: BackendService) {}

  ngOnInit() {
    this.backendService.get().then(
      allRows => this.onRowsReceived(allRows),
      err => {
        const key = window.prompt('Set key (leave blank for no action)');
        if (key) {
          localStorage.setItem('bookworm/google-api-key', key);
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
    this.rows = this.rows.filter(x => x.book === book);
  }

  public reset() {
    this.rows = (
      this.allRows.slice()
      // .slice(allRows.length - 5)
      // .filter(isNonEmpty)
    );
    this.rows.sort(rowComparator);
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
  } else { // x > y because of x !== y
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
