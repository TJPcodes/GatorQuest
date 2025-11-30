import Player from "../models/playerModel.js";
import User from "../models/userModel.js";


// ADMIN: Fetch all player documents
// Returns a full list of all Player objects in the DB

export const adminGetAllPlayers = async (req, res) => {
  const players = await Player.find();
  res.json(players);
};


// ADMIN: Update a specific player by ID
// Accepts any fields in req.body and applies them to the Player document

export const adminUpdatePlayer = async (req, res) => {
  const { id } = req.params;

  // Find the player by ID and apply updates
  const player = await Player.findByIdAndUpdate(id, req.body, { new: true });

  // If the player does not exist, return an error
  if (!player) return res.status(404).json({ message: "Player not found" });

  res.json({ message: "Player updated", player });
};

// ADMIN: Delete a specific player by ID
// Permanently removes the Player document from the database

export const adminDeletePlayer = async (req, res) => {
  const { id } = req.params;

  const player = await Player.findByIdAndDelete(id);
  if (!player) return res.status(404).json({ message: "Player not found" });

  res.json({ message: "Player deleted" });
};


// ADMIN: Fetch all user accounts
// Password hashes are excluded for safety/security

export const adminGetAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash"); 
  res.json(users);
};

// ADMIN: Update a specific user by ID
// Applies updates from req.body while ensuring the password hash is not returned

export const adminUpdateUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User updated", user });
};


// ADMIN: Delete a specific user account by ID
// Permanently removes the User document

export const adminDeleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
};
