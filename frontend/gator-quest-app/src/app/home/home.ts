import { Component } from '@angular/core';
import { Menu } from './menu/menu';
import { TextBox } from './text-box/text-box';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Menu, TextBox],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home {
  onProfileClick() {
    console.log('Profile icon clicked!');
  }
}
