import { Component } from '@angular/core';
import { Menu } from './menu/menu';
import { TextBox } from './text-box/text-box';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Menu, TextBox],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  currentState: "menu" | "game" = "menu";

  player = {
    gpa: 0,
    hunger: 0,
    happiness: 0
  };

  internalStats = {
    numCourses: 0
  }

  finishCourse(grade: number){
    this.player.gpa = (this.player.gpa * (this.internalStats.numCourses) + grade) / (this.internalStats.numCourses + 1);
    this.internalStats.numCourses += 1;
  }

  eat(recover: number){
    this.player.hunger -= recover;
  }

  

  onProfileClick() {
    console.log('Profile icon clicked!');
  }
  onStart(){
    this.currentState = "game";
    console.log("Switch to game state");
  }
}
