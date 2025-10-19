import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {

  @Output() startGameEvent = new EventEmitter<void>();

  onStartClick() {
    this.startGameEvent.emit();
  }

}
