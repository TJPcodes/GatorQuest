import Player from "../models/playerModel.js";
import Location from "../models/locationmodel.js";
import { yearPrompts, randomDailyEvents } from "../utils/storyEvents.js";

// Utility to clamp values cleanly
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

// STUDY ACTION
export const study = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy - 12, 0, 100);
  player.gpa = clamp(parseFloat((player.gpa + 0.04).toFixed(2)), 0, 4.0);

  await player.save();
  return res.json({ message: "You studied and improved your GPA slightly.", player });
};

// EAT ACTION
export const eat = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy + 20, 0, 100);

  await player.save();
  return res.json({ message: "You grabbed some food and restored energy.", player });
};

// REST ACTION
export const rest = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy + 30, 0, 100);

  await player.save();
  return res.json({ message: "You rested and regained energy.", player });
};

// PARTY ACTION
export const party = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy - 20, 0, 100);
  player.social = clamp(player.social + 12, 0, 100);

  if (Math.random() < 0.35) {
    player.gpa = clamp(parseFloat((player.gpa - 0.05).toFixed(2)), 0, 4.0);
  }

  await player.save();
  return res.json({ message: "You went out and improved your social life.", player });
};

// WORKOUT ACTION
export const workout = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy - 15, 0, 100);
  player.social = clamp(player.social + 5, 0, 100);

  await player.save();
  return res.json({ message: "You worked out and feel more focused.", player });
};

// ATTEND CLASS
export const attendClass = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy - 10, 0, 100);
  player.gpa = clamp(parseFloat((player.gpa + 0.05).toFixed(2)), 0, 4.0);

  await player.save();
  return res.json({ message: "You attended class and learned something useful.", player });
};


// ATTEND EVENT
export const attendEvent = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = clamp(player.energy - 10, 0, 100);
  player.social = clamp(player.social + 15, 0, 100);

  await player.save();
  return res.json({ message: "You attended an event and met new people.", player });
};

// NEXT DAY (CORE GAME LOOP)
export const nextDay = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  // advance day
  player.day += 1;

  // determine current UF year
  const currentYear =
    player.day <= 25 ? 1 :
    player.day <= 50 ? 2 :
    player.day <= 75 ? 3 : 4;

  // choose storyline prompt
  const storyLine = yearPrompts[currentYear][
    Math.floor(Math.random() * yearPrompts[currentYear].length)
  ];

  // random event every 3 days
  let event = null;
  if (player.day % 3 === 0) {
    event = randomDailyEvents[
      Math.floor(Math.random() * randomDailyEvents.length)
    ];

    if (event.energy) {
      player.energy = clamp(player.energy + event.energy, 0, 100);
    }
    if (event.gpa) {
      player.gpa = clamp(parseFloat((player.gpa + event.gpa).toFixed(2)), 0, 4.0);
    }
    if (event.social) {
      player.social = clamp(player.social + event.social, 0, 100);
    }
  }

  await player.save();

  // FAIL-OUT CHECK
  if (player.gpa < 1.0) {
    return res.json({
      message: "Your GPA has fallen below the minimum requirement. You are dismissed from UF.",
      player
    });
  }

  // GRADUATION CHECK
  if (player.day >= 100) {
    const { gpa, energy, social } = player;
    let message = "";

    // HONORS (3.7+)
    if (gpa >= 3.7) {
      message = "You finish your degree with strong academic performance.";
      message += energy < 20
        ? " Despite ending the year drained, your record stands out."
        : " You maintained balance through most of the semester.";
      if (social >= 70) message += " You also built strong connections along the way.";
      return res.json({ message, player });
    }

    // SOLID GRADUATE (3.0–3.69)
    if (gpa >= 3.0) {
      message = "You graduate with a solid academic record.";
      if (energy < 25) message += " You end the year exhausted but relieved.";
      if (social >= 70) message += " Your involvement creates opportunities post-graduation.";
      return res.json({ message, player });
    }

    // NARROW PASS (2.5–2.99)
    if (gpa >= 2.5) {
      message = "You meet graduation requirements, though the year was difficult.";
      if (social >= 70) message += " Your connections help give you direction moving forward.";
      if (energy < 20) message += " Low energy reflects how demanding the semester was.";
      return res.json({ message, player });
    }

    // BELOW GRADUATION THRESHOLD
    return res.json({
      message: "You complete the year but do not meet UF's graduation GPA requirement.",
      player
    });
  }

  // NORMAL DAY RESPONSE
  return res.json({
    message: event ? `${storyLine} ${event.text}` : storyLine,
    event,
    player
  });
};

// VISIT LOCATION
export const visitLocation = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  const { locationName } = req.body;
  const location = await Location.findOne({ name: locationName });
  if (!location) return res.status(404).json({ error: "Unknown location" });

  player.gpa = clamp(player.gpa + location.gpaEffect, 0, 4.0);
  player.energy = clamp(player.energy + location.energyEffect, 0, 100);
  player.social = clamp(player.social + location.socialEffect, 0, 100);

  player.location = location.name;

  await player.save();
  res.json({ message: `Visited ${location.name}`, effects: location, player });
};
