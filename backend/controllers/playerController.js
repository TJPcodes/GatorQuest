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

// study increases gpa but lowers energy
export const study = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.gpa = Math.min(4.0, player.gpa + 0.1);
  player.energy = Math.max(0, player.energy - 15);
  await player.save();

  res.json(player);
};

// eat restores energy
export const eat = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.min(100, player.energy + 20);
  await player.save();

  res.json(player);
};

// rest restores energy and lowers social
export const rest = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.min(100, player.energy + 30);
  player.social = Math.max(0, player.social - 5);
  await player.save();

  res.json(player);
};

// party increases social but lowers energy and gpa
export const party = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.social = Math.min(100, player.social + 25);
  player.energy = Math.max(0, player.energy - 20);
  player.gpa = Math.max(0, player.gpa - 0.05);
  await player.save();

  res.json(player);
};

// workout increases energy cap slightly and social a bit
export const workout = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.energy = Math.max(0, player.energy - 10);
  player.social = Math.min(100, player.social + 10);
  player.gpa = Math.min(4.0, player.gpa + 0.02);
  await player.save();

  res.json(player);
};

// attend class raises gpa slightly and lowers energy
export const attendClass = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.gpa = Math.min(4.0, player.gpa + 0.05);
  player.energy = Math.max(0, player.energy - 10);
  await player.save();

  res.json(player);
};


export const attendEvent = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.social = Math.min(100, player.social + 15);
  player.energy = Math.max(0, player.energy - 10);
  await player.save();

  res.json(player);
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