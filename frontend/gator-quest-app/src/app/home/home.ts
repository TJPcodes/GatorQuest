import { Component, OnInit } from '@angular/core';
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
export class Home implements OnInit {
  currentState: "menu" | "game" = "menu";
  player: any = {
    gpa: 0,
    energy: 0,
    social: 0
  };

  ngOnInit() {
    this.loadPlayerStats();
  }

  async loadPlayerStats() {
    try {
      const playerName = localStorage.getItem('playerName');
      const res = await fetch(`http://localhost:5000/api/players/byName/${playerName}`);
      const data = await res.json();
      this.player = data;
      console.log('Initial player loaded:', this.player);
    } catch (err) {
      console.error('Error loading player stats:', err);
    }
  }

  updatePlayerStats(player: any) {
    this.player = player;
    console.log('Player updated:', this.player);
  }

  onProfileClick() {
    console.log('Profile icon clicked!');
  }
  onStart(){
    this.currentState = "game";
    console.log("Switch to game state");
  }
}
