import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gpaEffect: { type: Number, default: 0 },
  energyEffect: { type: Number, default: 0 },
  socialEffect: { type: Number, default: 0 },
  description: { type: String }
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
