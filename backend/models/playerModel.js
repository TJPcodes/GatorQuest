import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gpa: { type: Number, default: 2.5 },
  energy: { type: Number, default: 100 },
  social: { type: Number, default: 50 },
  location: { type: String, default: "Reitz Union" }
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
