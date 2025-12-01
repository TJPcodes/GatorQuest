import Player from "../models/playerModel.js";

// Controller: Advances the game by one day for a specific player
export const nextDay = async (req, res) => {
 // Fetch the player from the database using the ID from the route
  const player = await Player.findById(req.params.id);
  // If no player exists with this ID, return a 404 error response
  if (!player) return res.status(404).json({ error: "Player not found" });

  // Move the game forward by one day
  player.day += 1;
  // Restore some energy, but never exceed 100
  player.energy = Math.min(100, player.energy + 10);
  // Base message displayed at the start of the new day
  let message = `Day ${player.day} begins.`;


  // -----------------------------
  //   Random Daily Events
  // -----------------------------

  const roll = Math.random();

  // 20% chance: GPA boost (productive study night)
  if (roll < 0.2) {
    player.gpa = Math.min(4.0, player.gpa + 0.05);
    message += " You had a productive study night!";

  // 20% chance: Social boost (meet new people)
  } else if (roll < 0.4) {
    player.social = Math.min(100, player.social + 10);
    message += " You met new people at the dining hall.";

  // 20% chance: Lose energy (stayed up late cramming)
  } else if (roll < 0.6) {
    player.energy = Math.max(0, player.energy - 20);
    message += " You stayed up late cramming!";

  // 40% chance: Nothing special happens
  } else {
    message += " A normal, uneventful day.";
  }

  // Save the updated player state after the daily changes
  await player.save();

  // Send back the current day's results
  res.json({ message, player });


  // -----------------------------
  //   Game Over / Win Conditions
  // -----------------------------

  // Failure condition: GPA below 1.0 → player fails out
  if (player.gpa < 1.0) {
  return res.json({ message: "You have failed out of UF. Game over!", player });
  }

  // Win condition: Reach Day 100 with a GPA of 3.0 or higher
  if (player.day >= 100 && player.gpa >= 3.0) {
    return res.json({ message: "Congratulations! You graduated successfully!", player });
  }

  // Save again in case end state conditions modified the player
  await player.save();

  // Final response fallback (though normally unreachable)
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
