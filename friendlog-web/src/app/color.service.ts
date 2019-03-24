<<<<<<< Updated upstream
import { Injectable } from "@angular/core";
||||||| merged common ancestors
import { Injectable } from '@angular/core';
=======
import { Injectable, OnInit } from "@angular/core";

type HSL = [number, number, number];
>>>>>>> Stashed changes

@Injectable({
  providedIn: "root"
})
export class ColorService {
<<<<<<< Updated upstream
  constructor() {}
||||||| merged common ancestors

  constructor() { }
=======
  palette: HSL[];

  constructor() {
    this.palette = this.createPalette();
    console.log(this.palette);
    console.log(this.palette.map(x => this.hslToRgb(x)));
    window.cs = this;
  }

  private createPalette() {
    // should this be in init or constructor?
    const mainColorsRaw = `
        $color1: hsla(0%, 95%, 47%, 1);
        $color2: hsla(42%, 100%, 48%, 1);
        $color3: hsla(79%, 100%, 36%, 1);
        $color4: hsla(205%, 100%, 42%, 1);
        $color5: hsla(287%, 82%, 37%, 1);
        `;

    // Parse
    let x: any = mainColorsRaw.replace(/\s/g, "");
    x = x.split(";").slice(0, 5);
    x = x.map(line => {
      const numbers = (line as string)
        .replace(/\$color\d:hsla\(/, "")
        .replace(")", "")
        .replace(/%/g, "")
        .split(",");
      return numbers.slice(0, 3).map(x => +x);
    });

    // Map to the space hslToRgb needs
    x = x.map(([h, s, l]) => [h / 360, s / 100, l / 100]);

    let y = x as HSL[];

    // prettier-ignore
    y = [].concat(
      y,
      y.map(([h, s, l]) => [h, s, l + 0.3]),
      y.map(([h, s, l]) => [h, s, l - 0.2])
    );

    return y;
  }

  public getColor(book: string): string {
    // return this.getColorByPalette(book);
    return this.getColorByHashing(book);
  }

  private getColorByPalette(book: string): string {
    const hash = this.hashString(book);
    const index = this.mod(hash, this.palette.length);
    // console.log(index);
    return this.hslToRgb(this.palette[index]);
  }
>>>>>>> Stashed changes

  /**
   * Adapted from https://stackoverflow.com/a/16348977
   */
<<<<<<< Updated upstream
  public getColor(book: string): string {
    if (book === "The Gamer") {
      return "#5aa8c6";
    }
||||||| merged common ancestors
  public getColor(book: string): string {
=======
  private getColorByHashing(book: string): string {
>>>>>>> Stashed changes
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

  private hslToRgb([h, s, l]): string {
    const [r, g, b] = this._hslToRgb(h, s, l);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Copied from https://stackoverflow.com/a/36722579
  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  private _hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Adapted from https://stackoverflow.com/a/7616484
  private hashString(s: string) {
    var hash = 0,
      i,
      chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
      chr = s.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  private mod(m, n) {
    return ((m % n) + n) % n;
  }
}
