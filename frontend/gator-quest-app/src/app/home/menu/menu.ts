import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextBox } from '../text-box/text-box';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, TextBox],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  standalone: true
})
export class Menu {
  @Input() player: any = {social: 0, energy: 0, gpa: 0};
}
