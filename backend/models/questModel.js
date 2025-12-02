import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: {
    gpa: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
  },
  requirement: {
    day: { type: Number, default: 1 },
    gpa: { type: Number, default: 0 },
  },
  completed: { type: Boolean, default: false },
});

const Quest = mongoose.model("Quest", questSchema);
export default Quest;
