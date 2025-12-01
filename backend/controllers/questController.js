import Quest from "../models/questModel.js";
import Player from "../models/playerModel.js";

// Fetch all available quests (used for UI quest lists)
export const getQuests = async (req, res) => {
  const quests = await Quest.find();
  res.json(quests);
};

export const startQuest = async (req, res) => {
  const { playerId, questId } = req.body;

  // Look up the quest and player involved
  const quest = await Quest.findById(questId);
  const player = await Player.findById(playerId);

  if (!quest || !player) return res.status(404).json({ error: "Not found" });

  // Prevent restarting a quest that was already finished
  if (quest.completed) {
    return res.json({ message: "This quest is already completed." });
  }

  // Assign the quest to the player
  player.activeQuest = quest._id;
  await player.save();

  return res.json({
    message: `Quest started: ${quest.title}`,
    quest,
    player
  });
};


export const completeQuest = async (req, res) => {
  const { playerId } = req.body;

  // Load player and auto-populate their active quest reference
  const player = await Player.findById(playerId).populate("activeQuest");
  const quest = player?.activeQuest;

  if (!player || !quest) {
    return res.status(404).json({ error: "No active quest to complete." });
  }

  // Requirement check: quests can require minimum day, GPA
  const meetsDay = player.day >= quest.requirement.day;
  const meetsGpa = player.gpa >= quest.requirement.gpa;

  // If all quest requirements are satisfied then reward the player
  if (meetsDay && meetsGpa) {
    quest.completed = true;
    player.activeQuest = null;

    // Apply rewards
    player.gpa = Math.min(4.0, player.gpa + quest.reward.gpa);
    player.energy = Math.min(100, player.energy + quest.reward.energy);
    player.social = Math.min(100, player.social + quest.reward.social);
    player.money += quest.reward.money;

    await quest.save();
    await player.save();

    return res.json({
      message: `${quest.title} completed!`,
      player,
      quest
    });
  }

  // Requirements not met then return progress info for the frontend UI
  return res.json({
    message: `Quest not completed yet. You still need: 
      Day ≥ ${quest.requirement.day}, 
      GPA ≥ ${quest.requirement.gpa.toFixed(2)}.`,
    progress: {
      currentDay: player.day,
      currentGpa: player.gpa
    }
  });
};
