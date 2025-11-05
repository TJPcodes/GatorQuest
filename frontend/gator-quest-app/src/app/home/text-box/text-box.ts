import { Component } from '@angular/core';
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
}
