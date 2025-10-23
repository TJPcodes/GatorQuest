// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "./models/locationmodel.js";

dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Array of default campus locations
const locations = [
  {
    name: "Library West",
    description: "A quiet place to study. Increases GPA but costs energy.",
    gpaEffect: 0.1,
    energyEffect: -15,
    socialEffect: 0,
  },
  {
    name: "The Swamp",
    description: "Home football game atmosphere. Boosts social but drains energy.",
    gpaEffect: -0.05,
    energyEffect: -20,
    socialEffect: 25,
  },
  {
    name: "Reitz Union",
    description: "Central student hub. Good balance between social and rest.",
    gpaEffect: 0,
    energyEffect: 10,
    socialEffect: 10,
  },
  {
    name: "Dorm",
    description: "Rest and recover your energy.",
    gpaEffect: 0,
    energyEffect: 30,
    socialEffect: -5,
  },
  {
    name: "Gym",
    description: "Work out to feel better. Small GPA gain, social boost, energy drain.",
    gpaEffect: 0.02,
    energyEffect: -10,
    socialEffect: 10,
  },
  {
    name: "Beach",
    description: "Skip class and relax. Big social boost but drains GPA and energy.",
    gpaEffect: -0.1,
    energyEffect: -15,
    socialEffect: 30,
  },
  {
    name: "Classroom",
    description: "Attend lectures to raise GPA but lose some energy.",
    gpaEffect: 0.05,
    energyEffect: -10,
    socialEffect: 0,
  },
];

// Function to clear and insert data
const seedLocations = async () => {
  try {
    await Location.deleteMany();
    console.log("Old locations cleared.");

    await Location.insertMany(locations);
    console.log("New locations added successfully.");

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding locations:", error);
    mongoose.connection.close();
  }
};

seedLocations();
