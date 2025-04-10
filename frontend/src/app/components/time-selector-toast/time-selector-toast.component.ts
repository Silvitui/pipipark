import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-time-selector-toast',
  templateUrl: './time-selector-toast.component.html',
  standalone: true
})
export class TimeSelectorToastComponent {
  @Output() selected = new EventEmitter<number>();

  select(minutes: number) {
    this.selected.emit(minutes);
  }
}
