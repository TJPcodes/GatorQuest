import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },

  gpa: { type: Number, default: 2.5, min: 0, max: 4.0 },
  energy: { type: Number, default: 100, min: 0, max: 100 },
  social: { type: Number, default: 50, min: 0, max: 100 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },


  location: { type: String, default: "Reitz Union" },

  money: { type: Number, default: 50 },    
  day: { type: Number, default: 1 },  

  lastUpdated: { type: Date, default: Date.now }
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
