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
import * as moment from "moment";
import * as _ from "lodash";

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
    const startDate = moment(this.configService.getCalendarStartDate());
    const today = moment().startOf("day");
    let d = startDate;
    this.weeks = [];
    while (d.isSameOrBefore(today)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(this.makeDay(d));
        d = d.clone().add(1, "day");
      }
      this.weeks.push(week);
    }
  }

  private makeDay(d: moment.Moment) {
    // todo add typing to the day object
    const day = {
      d: d.date(),
      fullDate: d.toDate() // todo Date -> moment
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
