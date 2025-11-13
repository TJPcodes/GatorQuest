import Player from "../models/playerModel.js";
import Location from "../models/locationmodel.js";

// get all players
export const getPlayers = async (req, res) => {
  const players = await Player.find();
  res.json(players);
};

// create a new player
export const createPlayer = async (req, res) => {
  const { name } = req.body;
  const player = new Player({ name });
  await player.save();
  res.json(player);
};

// study increases GPA a little, costs energy
export const study = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.max(0, player.energy - 12);
  player.gpa = Math.min(4.0, parseFloat((player.gpa + 0.04).toFixed(2)));

  await player.save();
  return res.json({
    message: "You studied hard and improved your GPA slightly.",
    player
  });
};

// eat restores energy
export const eat = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.min(100, player.energy + 20);

  await player.save();
  return res.json({
    message: "You grabbed some food and recovered energy.",
    player
  });
};

// rest restores lots of energy
export const rest = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.min(100, player.energy + 30);

  await player.save();
  return res.json({
    message: "You rested and regained a good amount of energy.",
    player
  });
};

// party boosts social a lot, but risks GPA loss
export const party = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.max(0, player.energy - 20);
  player.social = Math.min(100, player.social + 12);

  // chance of GPA loss
  if (Math.random() < 0.35) {
    player.gpa = Math.max(0, parseFloat((player.gpa - 0.05).toFixed(2)));
  }

  await player.save();
  return res.json({
    message: "You went out! Social went up, but your GPA might have slipped...",
    player
  });
};

// workout boosts social & health, moderate energy cost
export const workout = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.max(0, player.energy - 15);
  player.social = Math.min(100, player.social + 5);

  await player.save();
  return res.json({
    message: "You worked out and feel motivated.",
    player
  });
};

// class raises GPA, moderate energy cost
export const attendClass = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.max(0, player.energy - 10);
  player.gpa = Math.min(4.0, parseFloat((player.gpa + 0.05).toFixed(2)));

  await player.save();
  return res.json({
    message: "You attended class — small but meaningful GPA gain.",
    player
  });
};

// events boost social moderately
export const attendEvent = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.max(0, player.energy - 10);
  player.social = Math.min(100, player.social + 15);

  await player.save();
  return res.json({
    message: "You joined a campus event and made new social connections.",
    player
  });
};

export const nextDay = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.day += 1;
  player.energy = Math.min(100, player.energy + 20); // overnight restore
  const events = [
  { text: "You found $5 on the ground!", money: +5 },
  { text: "You overslept. -10 energy.", energy: -10 },
  { text: "A friend bought you coffee. +10 social.", social: +10 },
];

const happening = events[Math.floor(Math.random() * events.length)];

player.money += happening.money ?? 0;
player.energy = Math.max(0, Math.min(100, player.energy + (happening.energy ?? 0)));
player.social = Math.max(0, Math.min(100, player.social + (happening.social ?? 0)));
await player.save();

  res.json({ message: happening.text, player });
  res.json({
    message: `A new day begins at UF... Day ${player.day}`,
    player
  });
};

export const visitLocation = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  const { locationName } = req.body;
  const location = await Location.findOne({ name: locationName });
  if (!location) return res.status(404).json({ error: "Unknown location" });

  player.gpa = Math.min(4.0, player.gpa + location.gpaEffect);
  player.energy = Math.max(0, Math.min(100, player.energy + location.energyEffect));
  player.social = Math.max(0, Math.min(100, player.social + location.socialEffect));

  player.location = location.name;
  await player.save();

  res.json({ message: `Visited ${location.name}`, effects: location, player });
};