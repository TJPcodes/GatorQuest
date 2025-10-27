import Player from "../models/playerModel.js";

export const nextDay = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.day += 1;
  player.energy = Math.min(100, player.energy + 10);
  let message = `Day ${player.day} begins.`;

  const roll = Math.random();
  if (roll < 0.2) {
    player.gpa = Math.min(4.0, player.gpa + 0.05);
    message += " You had a productive study night!";
  } else if (roll < 0.4) {
    player.social = Math.min(100, player.social + 10);
    message += " You met new people at the dining hall.";
  } else if (roll < 0.6) {
    player.energy = Math.max(0, player.energy - 20);
    message += " You stayed up late cramming!";
  } else {
    message += " A normal, uneventful day.";
  }

  await player.save();
  res.json({ message, player });

  if (player.gpa < 1.0) {
  return res.json({ message: "You have failed out of UF. Game over!", player });
  }
  if (player.day >= 100 && player.gpa >= 3.0) {
    return res.json({ message: "Congratulations! You graduated successfully!", player });
  }

  await player.save();
  res.json({ message, player });

};

// check current game status (should be useful for frontend updates)
export const getGameStatus = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json({
    name: player.name,
    day: player.day,
    location: player.location,
    gpa: player.gpa,
    energy: player.energy,
    social: player.social,
    money: player.money
  });
};

// reset the game (for testing or new game)
export const resetGame = async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.day = 1;
  player.gpa = 2.5;
  player.energy = 100;
  player.social = 50;
  player.money = 50;
  player.location = "Reitz Union";

  await player.save();
  res.json({ message: "Game reset successful.", player });
};
