import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";

@Injectable({
  providedIn: "root"
})
export class ColorService {
  chosenColors: { [book: string]: string };

  constructor(private backendService: BackendService) {
    this.chosenColors = {};
    const cached = this.backendService.getColorsCached();
    if (cached) {
      this.chosenColors = cached;
    }
    this.backendService.getColors().then(colors => {
      this.chosenColors = colors;
    });
  }

  /**
   * Adapted from https://stackoverflow.com/a/16348977
   */
  public getColor(book: string): string {
    if (this.chosenColors.hasOwnProperty(book)) {
      return this.chosenColors[book];
    }
    var hash = 0;
    for (var i = 0; i < book.length; i++) {
      hash = book.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  }
}
