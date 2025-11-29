import Player from "../models/playerModel.js";
import Location from "../models/locationmodel.js";
import { yearPrompts, randomDailyEvents } from "../utils/storyEvents.js";
import { checkGameEnd } from "./gameController.js";


const PENALTY_THRESHOLD = 50;
const PENALTY_DELTA = 0.1;  

// Utility clamp
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Helper function to check game end and add to response
async function buildActionResponse(message, player) {
  // Check if this is the 3rd choice (every 60 days since start)
  // Day starts at 1, so: 61, 121, 181, 241, 301
  let eventMessage = "";
  const daysSinceStart = player.day - 1;
  console.log(`buildActionResponse: player.day=${player.day}, daysSinceStart=${daysSinceStart}, daysSinceStart % 60 = ${daysSinceStart % 60}`);
  
  if (daysSinceStart > 0 && daysSinceStart % 60 === 0) {
    console.log("Random event triggered!");
    eventMessage = applyRandomEvent(player);
  }

  
  let dailyPenalty = false;
  if (player.energy < PENALTY_THRESHOLD || player.social < PENALTY_THRESHOLD) {
    player.gpa = clamp(parseFloat((player.gpa - PENALTY_DELTA).toFixed(2)), 0, 4.0);
    dailyPenalty = true;
  }

  if (eventMessage || dailyPenalty) {
    await player.save();
  }

  const response = {
    message: message + eventMessage,
    dailyPenalty,
    player
  };

  return response;
}

// Helper function to increment day with each action
function incrementDay(player) {
  player.day = Math.min(player.day + 20, 400); // Each choice is 20 days, cap at 400 to allow all events
}

// Helper function to apply random event (happens every 3 choices)
function applyRandomEvent(player) {
  const roll = Math.random();
  let eventMessage = "";
  
  if (roll < 0.2) {
    player.gpa = clamp(parseFloat((player.gpa + 0.05).toFixed(2)), 0, 4.0);
    eventMessage = " [Random event: You had a productive study week!]";
  } else if (roll < 0.4) {
    player.social = clamp(player.social + 10, 0, 100);
    eventMessage = " [Random event: You met new people!]";
  } else if (roll < 0.5) {
    player.gpa = clamp(parseFloat((player.gpa - 0.10).toFixed(2)), 0, 4.0);
    eventMessage = " [Random event: You missed an important assignment deadline!]";
  } else if (roll < 0.6) {
    player.energy = clamp(player.energy - 20, 0, 100);
    eventMessage = " [Random event: You stayed up late!]";
  } else {
    eventMessage = " [Random event: Normal week.]";
  }
  
  return eventMessage;
}

// GET ALL PLAYERS
export const getPlayers = async (req, res) => {
  const players = await Player.find();
  res.json(players);
};

// CREATE NEW PLAYER
export const createPlayer = async (req, res) => {
  const { name } = req.body;
  const player = new Player({ name });
  await player.save();
  res.json(player);
};

// GET PLAYER BY NAME
export const getPlayerByName = async (req, res) => {
  const player = await Player.findOne({ name: req.params.name });
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json(player);
};

// UPDATE PLAYER (for saving story progress)
export const updatePlayer = async (req, res) => {
  const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json(player);
};

// STUDY ACTION
export const study = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  console.log(`study action: player.day BEFORE increment = ${player.day}`);
  incrementDay(player);
  console.log(`study action: player.day AFTER increment = ${player.day}`);
  player.energy = clamp(player.energy - 8, 0, 100);
  const gpaGain = 0.06 * (player.energy + player.social) / 200;
  player.gpa = clamp(parseFloat((player.gpa + gpaGain).toFixed(2)), 0, 4.0);

  await player.save();
  const response = await buildActionResponse("You studied and improved your GPA slightly.", player);
  return res.json(response);
};

// EAT
export const eat = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  incrementDay(player);
  player.energy = clamp(player.energy + 20, 0, 100);
  await player.save();
  const response = await buildActionResponse("You grabbed some food and restored energy.", player);
  return res.json(response);
};

// REST
export const rest = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  incrementDay(player);
  const restGain = 30 * (100 - player.energy) / 100; 
  player.energy = clamp(player.energy + Math.round(restGain), 0, 100);
  await player.save();
  const response = await buildActionResponse("You rested and regained energy.", player);
  return res.json(response);
};

// PARTY
export const party = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  incrementDay(player);
  player.energy = clamp(player.energy - 15, 0, 100);
  const socialGainParty = 12 * (100 - player.social) / 100;
  player.social = clamp(player.social + Math.round(socialGainParty), 0, 100);

  if (Math.random() < 0.35) {
    player.gpa = clamp(parseFloat((player.gpa - 0.05).toFixed(2)), 0, 4.0);
  }

  await player.save();
  const response = await buildActionResponse("You went out and improved your social life.", player);
  return res.json(response);
};

// WORKOUT
export const workout = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  incrementDay(player);
  player.energy = clamp(player.energy - 10, 0, 100);
  player.social = clamp(player.social + 5, 0, 100);

  await player.save();
  const response = await buildActionResponse("You worked out and feel more focused.", player);
  return res.json(response);
};

// ATTEND CLASS
export const attendClass = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  incrementDay(player);
  player.energy = clamp(player.energy - 6, 0, 100);
  const gpaGain = 0.08 * (player.energy + player.social) / 200;
  player.gpa = clamp(parseFloat((player.gpa + gpaGain).toFixed(2)), 0, 4.0);
  await player.save();
  const response = await buildActionResponse("You attended class and learned something useful.", player);
  return res.json(response);
};

// ATTEND EVENT
export const attendEvent = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  incrementDay(player);
  player.energy = clamp(player.energy - 6, 0, 100);
  const socialGainEvent = 15 * (100 - player.social) / 100;
  player.social = clamp(player.social + Math.round(socialGainEvent), 0, 100);

  await player.save();
  const response = await buildActionResponse("You attended an event and met new people.", player);
  return res.json(response);
};

// NEXT DAY (main loop)
export const nextDay = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.day += 1;

  const currentYear =
    player.day <= 25 ? 1 :
    player.day <= 50 ? 2 :
    player.day <= 75 ? 3 : 4;

  const storyLine =
    yearPrompts[currentYear][
      Math.floor(Math.random() * yearPrompts[currentYear].length)
    ];

  let event = null;
  if (player.day % 3 === 0) {
    event = randomDailyEvents[
      Math.floor(Math.random() * randomDailyEvents.length)
    ];

    if (event.energy) player.energy = clamp(player.energy + event.energy, 0, 100);
    if (event.gpa) player.gpa = clamp(parseFloat((player.gpa + event.gpa).toFixed(2)), 0, 4.0);
    if (event.social) player.social = clamp(player.social + event.social, 0, 100);
  }

  
  let dailyPenalty = false;
  if (player.energy < 50 || player.social < 50) {
    player.gpa = clamp(parseFloat((player.gpa - 0.10).toFixed(2)), 0, 4.0);
    dailyPenalty = true;
  }

  await player.save();

  // Fail-out
  if (player.gpa < 1.0) {
    return res.json({
      message: "Your GPA has fallen below UF’s requirement. You are dismissed.",
      player
    });
  }

  // Graduation
  if (player.day >= 100) {
    return res.json(generateGraduationMessage(player));
  }

  return res.json({
    message: `A new day begins at UF... Day ${player.day}`,
    storyLine,
    event,
    dailyPenalty,
    player
  });
};

// Graduation helper
function generateGraduationMessage(player) {
  const { gpa, energy, social } = player;
  let msg = "";

  if (gpa >= 3.7) {
    msg = "You graduate with honors! Excellent academics.";
    if (social >= 70) msg += " You were well-connected too!";
    if (energy < 20) msg += " You’re exhausted but proud.";
  } else if (gpa >= 3.0) {
    msg = "You graduate with a solid academic record.";
    if (social >= 70) msg += " Your involvement pays off!";
  } else if (gpa >= 2.5) {
    msg = "You graduate, but it was a tough journey.";
  } else {
    msg = "You complete the year but do not meet UF's GPA requirement.";
  }

  return { message: msg, player };
}

// VISIT LOCATION
export const visitLocation = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  const { locationName } = req.body;
  const location = await Location.findOne({ name: locationName });
  if (!location) return res.status(404).json({ error: "Unknown location" });

  incrementDay(player);
  player.gpa = clamp(player.gpa + location.gpaEffect, 0, 4.0);
  player.energy = clamp(player.energy + location.energyEffect, 0, 100);
  player.social = clamp(player.social + location.socialEffect, 0, 100);

  player.location = location.name;
  await player.save();
  const response = await buildActionResponse(`Visited ${location.name}`, player);
  response.effects = location;
  res.json(response);
};



//CONNECT PLAYER STATS
export const applyAction = async (req, res) => {
  try {
    const { playerId, action } = req.body;

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    // Apply each stat change
    player.energy = Math.max(0, Math.min(100, player.energy + (action.energy || 0)));
    player.social = Math.max(0, Math.min(100, player.social + (action.social || 0)));
    player.gpa = Math.max(0, Math.min(4, player.gpa + (action.gpa || 0)));
    player.money = player.money + (action.money || 0);

    await player.save();

    res.json({ message: "Action applied", player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
