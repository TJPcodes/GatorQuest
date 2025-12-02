import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { storyChoices } from '../../story/storyChoices';

interface StoryItem {
  id: string;
  text: string;
  options: Array<{ label: string; action: string }>;
}

@Component({
  selector: 'app-text-box',
  imports: [ InputTextModule, CommonModule, FormsModule ],
  templateUrl: './text-box.html',
  styleUrl: './text-box.css',
  standalone: true
})
export class TextBox implements OnInit, OnChanges {
  @Input() currentStory: StoryItem | null = null;
  @Output() choiceSelected = new EventEmitter<{ player: any; message: string }>();
  @Output() startRequested = new EventEmitter<void>();
  @Output() advanceRequested = new EventEmitter<void>();
  @Output() gameOver = new EventEmitter<{ message: string; status: string }>();
  
  storyContent: string = 'Welcome to Gator Quest!';
  choices: Array<{ label: string; action: string }> = [];

  ngOnInit() {
    this.updateStoryDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentStory']) {
      this.updateStoryDisplay();
    }
  }

  updateStoryDisplay() {
    if (this.currentStory) {
      this.storyContent = this.currentStory.text;
      this.choices = this.currentStory.options;
      console.log('Story updated:', this.currentStory);
    }
  }

  requestStart() {
    this.startRequested.emit();
  }

  async selectChoice(action: string) {
    console.log('selectChoice called with', action);
    const playerId = localStorage.getItem('playerId');
    const validCommands = new Set(["study", "eat", "rest", "party", "workout", "class", "event", "visit", "next-day"]);
    
    if (validCommands.has(action)) {
      try {
        console.log(`Calling: http://localhost:5000/api/players/${playerId}/${action}`);
        const res = await fetch(`http://localhost:5000/api/players/${playerId}/${action}`, {
          method: "PUT"
        });

        console.log('Response status:', res.status, res.ok);

        if (!res.ok) {
          console.error('Server returned non-OK response for action', action, res.status);
          const errorText = await res.text();
          console.error('Error response:', errorText);
          this.advanceRequested.emit();
          return;
        }

        const data = await res.json();
        console.log('Response data:', data);
        
        // Check if game ended
        if (data.gameOver) {
          console.log('Game over detected!', data);
          this.gameOver.emit({ 
            message: data.message, 
            status: data.gameStatus 
          });
          return;
        }
        
        if (data.player) {
          this.choiceSelected.emit({
            player: data.player,
            message: data.message
          });
          console.log('choiceSelected emitted player:', data.player, 'message:', data.message);
        } else {
          console.warn('No player data in response:', data);
          this.advanceRequested.emit();
        }
      } catch (err) {
        console.error("Error:", err);
        this.advanceRequested.emit();
      }
    } else {
      console.log("Invalid command: ", action);
    }
  }
}