import { Injectable } from "@angular/core";

// todo use a config file outside of git
const config = {
  // This can be any day of the week (so you can use this to choose whether the
  // week starts on Sunday, Monday, ...)
  calendarStartDate: new Date(2019, 0, 14)
};

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  constructor() {}

  getCalendarStartDate(): Date {
    return config.calendarStartDate;
  }
}
