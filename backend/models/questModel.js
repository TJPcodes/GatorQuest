import mongoose from "mongoose";


// Defines tasks players can complete to gain rewards.
// Each quest has requirements (minimum day/GPA) and reward values that
// impact the player's stats or currency.

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Name of the quest
  description: { type: String, required: true },  // What the quest is about

  // Stat and resource rewards granted upon completion

  reward: {
    gpa: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
  },

  // Requirements the player must meet before completing the quest
  requirement: {
    day: { type: Number, default: 1 },  // Minimum day in-game
    gpa: { type: Number, default: 0 },  // Minimum GPA
  },
  completed: { type: Boolean, default: false },  // Whether quest has been finished
});


// Quests stored in the 'quests' collection
const Quest = mongoose.model("Quest", questSchema);

export default Quest;
