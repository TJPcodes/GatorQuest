import Player from "../models/playerModel.js";
import User from "../models/userModel.js";


export const adminGetAllPlayers = async (req, res) => {
  const players = await Player.find();
  res.json(players);
};

export const adminUpdatePlayer = async (req, res) => {
  const { id } = req.params;

  const player = await Player.findByIdAndUpdate(id, req.body, { new: true });
  if (!player) return res.status(404).json({ message: "Player not found" });

  res.json({ message: "Player updated", player });
};

export const adminDeletePlayer = async (req, res) => {
  const { id } = req.params;

  const player = await Player.findByIdAndDelete(id);
  if (!player) return res.status(404).json({ message: "Player not found" });

  res.json({ message: "Player deleted" });
};


export const adminGetAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash"); 
  res.json(users);
};

export const adminUpdateUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User updated", user });
};

export const adminDeleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
};
