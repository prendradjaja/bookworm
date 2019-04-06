import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { Row } from "../backend.service";
import { ColorService } from "../color.service";
import { ConfigService } from "../config.service";

@Component({
  selector: "calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() allRows: Row[];
  @Input() currentDateFilter: Date;
  @Output() filterByDate = new EventEmitter<Date>();

  weeks = [];
  showFullCalendar = false;
  private eventsByDate: { [date: string]: Row[] };

  constructor(
    private colorService: ColorService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    const foos = (window["cals"] = window["cals"] || []); // ptodo-debug
    const el = this["pdebugEl"] && this["pdebugEl"]["nativeElement"];
    el && el.setAttribute("pdebugIndex", "cal." + foos.length);
    foos.push(this);
    window["cal"] = this;
  }

  ngOnChanges() {
    this.computeEventsByDate();
    this.computeWeeks();
    // todo if i do a console.log here, i can see that this seems to only get run twice (on initial set and on re-set) -- why is that true [even tho i'm not using immutable data]
  }

  visibleWeeks() {
    if (this.showFullCalendar) {
      return this.weeks;
    }
    return this.weeks.slice(this.weeks.length - 2);
  }

  toggleCalendar() {
    this.showFullCalendar = !this.showFullCalendar;
  }

  public clickCalendarDay(e) {
    this.filterByDate.emit(e.fullDate as Date); // ptodo emit filter event
  }

  private computeEventsByDate(): void {
    this.eventsByDate = {};
    this.allRows.forEach(row => {
      const key = stos(row.createdAt);
      if (this.eventsByDate[key]) {
        this.eventsByDate[key].push(row);
      } else {
        this.eventsByDate[key] = [row];
      }
    });
  }

  private computeWeeks() {
    const startDate = this.configService.getCalendarStartDate();
    let d = startDate;
    this.weeks = [];
    while (d.getTime() < new Date().getTime()) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(this.makeDay(d));
        d = add(d, 1);
      }
      this.weeks.push(week);
    }
  }

  private makeDay(d: Date) {
    // todo add typing to the day object
    const day = {
      d: d.getDate(),
      fullDate: d
    } as any;

    // "today" = the current day we're iterating on
    const todaysEvents = this.eventsByDate[dtos(d)];

    if (!todaysEvents) {
      day.numEvents = 0;
      return day;
    }

    const colors = new Set();
    todaysEvents.forEach(row => {
      colors.add(this.colorService.getColor(row.book));
    });
    if (colors.size === 1) {
      day.color = oneItemSetToItem(colors);
    } else if (colors.size === 2) {
      // topColor is the color of the last (most recent) entry on this day

      // this computation of lastBook is dependent on db rows being sorted by createdAt
      const lastBook = todaysEvents[todaysEvents.length - 1].book;
      const lastColor = this.colorService.getColor(lastBook);
      day.multiColor = true;
      // todo the more frequent one should be on top
      const [color1, color2] = twoItemSetToArray(colors);
      if (color1 === lastColor) {
        [day.topColor, day.rightColor] = [color1, color2];
      } else if (color2 === lastColor) {
        [day.topColor, day.rightColor] = [color2, color1];
      } else {
        [day.topColor, day.rightColor] = [color1, color2];
        console.warn("Neither color is lastColor");
      }
    } else if (colors.size > 2) {
      day.multiColor = true;
      day.topColor = getAnyItem(colors);
      day.rightColor = "black";
    } else {
      day.color = "black";
    }
    day.numEvents = todaysEvents.length;

    if (anyIsEnd(todaysEvents)) {
      day.endOfBook = true;
    }
    return day;
  }
}

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

function add(d: Date, days) {
  const DAY_IN_MS = 1000 * 60 * 60 * 24;
  return new Date(d.getTime() + DAY_IN_MS * days);
}

function oneItemSetToItem<T>(s: Set<T>): T {
  if (s.size !== 1) {
    window.alert("this set is not a one item set");
  } else {
    let items = [];
    s.forEach(x => items.push(x));
    return items[0];
  }
}

function twoItemSetToArray<T>(s: Set<T>): T[] {
  if (s.size !== 2) {
    window.alert("this set is not a two item set");
  } else {
    let items = [] as T[];
    s.forEach(x => items.push(x));
    return items;
  }
}

function getAnyItem<T>(s: Set<T>): T[] {
  if (s.size < 1) {
    window.alert("this set is empty");
  } else {
    let items = [];
    s.forEach(x => items.push(x));
    return items[0];
  }
}

function anyIsEnd(rows: Row[]) {
  return rows.some(x => x.notes === "end");
}
