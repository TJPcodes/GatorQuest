import mongoose from "mongoose";


// Represents a place the player can visit on campus
// Each location can modify the player's stats (GPA, energy, social)
// and includes a description for UI display

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Location name
  gpaEffect: { type: Number, default: 0 }, // GPA impact when visiting this location
  energyEffect: { type: Number, default: 0 }, // Energy gain or loss
  socialEffect: { type: Number, default: 0 }, // Social stat impact
  description: { type: String }  // Optional description for the frontend
});

// Locations are stored in the 'locations' collection

const Location = mongoose.model("Location", locationSchema);
export default Location;
