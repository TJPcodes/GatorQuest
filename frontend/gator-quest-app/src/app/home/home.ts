import { Component, OnInit } from '@angular/core';
import { Menu } from './menu/menu';
import { TextBox } from './text-box/text-box';
import { CommonModule } from '@angular/common';
import { storyChoices } from '../story/storyChoices';

interface StoryItem {
  id: string;
  text: string;
  options: Array<{ label: string; action: string }>;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, Menu, TextBox],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home implements OnInit {
  currentState: "menu" | "game" | "event" | "gameover" = "menu";
  player: any = {
    gpa: 0,
    energy: 0,
    social: 0,
    day: 0
  };

  currentStory: StoryItem | null = null;
  storyIndex: number = -1;
  storiesCompleted: boolean = false;  // Track if all stories have been played
  eventMessage: string = "";  // Store event message to display
  gameOverMessage: string = "";
  gameStatus: string = "";

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

  updatePlayerStats(response: any) {
    console.log('updatePlayerStats called with response:', response);
    const player = response.player;
    const message = response.message;
    
    if (player) {
      this.player = player;
      console.log('Player updated:', this.player);
    } else {
      console.warn('No player data received from server');
      return;
    }
    
    // Check if there's a random event in the message (contains "[Random event:")
    if (message && message.includes("[Random event:")) {
      // Extract the event message and clean it up
      const eventStart = message.indexOf("[Random event:");
      let eventMessage = message.substring(eventStart);
      // Remove the brackets
      eventMessage = eventMessage.replace("[Random event: ", "").replace("]", "");
      this.eventMessage = eventMessage;
      this.currentState = "event";
      console.log("Displaying random event:", this.eventMessage);
    } else {
      this.getNextStory();
    }
    
    console.log('storyIndex now:', this.storyIndex, 'currentStory id:', this.currentStory?.id);
  }

  onEventNext() {
    this.currentState = "game";
    this.getNextStory();
    this.eventMessage = "";
  }

  lastActionMessage: string = "";  // Track last action message to detect events

  getNextStory() {
    // Don't advance story if game is over
    if (this.currentState === "gameover") {
      console.log("Game is already over, not advancing story");
      return;
    }

    // Move to next story
    const wasAtEnd = this.storyIndex === storyChoices.length - 1;
    this.storyIndex = (this.storyIndex + 1) % storyChoices.length;
    this.currentStory = storyChoices[this.storyIndex];
    
    console.log(`getNextStory: wasAtEnd=${wasAtEnd}, storyIndex=${this.storyIndex}, storyLength=${storyChoices.length}, currentStory=${this.currentStory?.id}`);
    
    // If we were at the last story and now we've wrapped around, all stories are done
    if (wasAtEnd && this.storyIndex === 0) {
      console.log("All stories completed!");
      this.storiesCompleted = true;
      const gameEndResult = this.evaluateGameEnd();
      console.log("Game end result:", gameEndResult);
      if (gameEndResult.isGameOver) {
        this.handleGameOver(gameEndResult.message, gameEndResult.status);
      }
    }
  }

  evaluateGameEnd() {
    // Only evaluate game end if all stories have been completed
    if (!this.storiesCompleted) {
      return { isGameOver: false, status: "", message: "" };
    }
    
    // Check if player failed out (GPA < 1.0)
    if (this.player.gpa < 1.0) {
      return {
        isGameOver: true,
        status: "failed",
        message: "You have failed out of UF. Game over!"
      };
    }
    
    // If all stories completed and GPA >= 1.0, player graduates
    return {
      isGameOver: true,
      status: "graduated",
      message: "Congratulations, you graduated successfully!"
    };
  }

  handleGameOver(message: string, status: string) {
    this.currentState = "gameover";
    this.gameOverMessage = message;
    this.gameStatus = status;
    console.log("Game Over! Status:", status, "Message:", message);
  }

  onProfileClick() {
    console.log('Profile icon clicked!');
  }

  onStart(){
    this.currentState = "game";
    this.storiesCompleted = false;  // Reset stories completed flag
    this.storyIndex = -1;  // Reset to -1 so first story will be at index 0
    this.resetPlayerStats();
    this.resetPlayerOnBackend();  // Reset player data in backend
    const startIndex = storyChoices.findIndex(story => story.id === "freshman1");
    this.storyIndex = startIndex >= 0 ? startIndex : 0;
    this.currentStory = storyChoices[this.storyIndex] || null;
    console.log("Switch to game state");
    console.log("Current story:", this.currentStory);
  }

  resetPlayerStats() {
    // Reset to default stats
    this.player = {
      gpa: 2.5,
      energy: 100,
      social: 50,
      money: 50,
      day: 1,
      name: this.player.name || localStorage.getItem('playerName')
    };
  }

  async resetPlayerOnBackend() {
    try {
      const playerId = localStorage.getItem('playerId');
      const res = await fetch(`http://localhost:5000/api/game/${playerId}/reset`, {
        method: "POST"
      });
      const data = await res.json();
      console.log('Player reset on backend:', data.player);
      // Update frontend with reset data from backend
      this.player = data.player;
    } catch (err) {
      console.error('Error resetting player on backend:', err);
    }
  }
}
