import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Row } from '../backend.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input() row: Row;

  @Output() onClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  handleClick(who: string) {
    this.onClick.emit(who);
  }

  /**
   * Adapted from https://stackoverflow.com/a/16348977
   */
  getColor(): string {
    var hash = 0;
    for (var i = 0; i < this.row.book.length; i++) {
      hash = this.row.book.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

}
