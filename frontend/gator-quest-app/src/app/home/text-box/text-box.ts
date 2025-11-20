import { Component, EventEmitter, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-box',
  imports: [ InputTextModule, CommonModule, FormsModule ],
  templateUrl: './text-box.html',
  styleUrl: './text-box.css',
  standalone: true
})
export class TextBox {
  userInput: string = '';
  player: any = {};
  @Output() playerUpdated = new EventEmitter<any>();
  async sendCommand() {
    console.log('User Input:', this.userInput);
    const command = this.userInput.trim().toLowerCase();
    const playerId = localStorage.getItem('playerId');
    const validCommands = new Set(["study", "eat", "rest", "party", "workout", "class", "event", "visit", "next-day"]);
    if (validCommands.has(command)) {
      try {
        const res = await fetch(`http://localhost:5000/api/players/${playerId}/${command}`, {
          method: "PUT"
        });

        const data = await res.json();
        this.playerUpdated.emit(data.player);
        console.log(data.player);
        } 
      catch (err) {
        console.error("Error:", err);
      }
   }
   else {
      console.log("Invalid command: ", command);
   }
   this.userInput = '';
 }
}