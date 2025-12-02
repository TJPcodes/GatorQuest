import Quest from "../models/questModel.js";
import Player from "../models/playerModel.js";
import { checkGameEnd } from "./gameController.js";

export const getQuests = async (req, res) => {
  const quests = await Quest.find();
  res.json(quests);
};

export const startQuest = async (req, res) => {
  const { playerId, questId } = req.body;
  const quest = await Quest.findById(questId);
  const player = await Player.findById(playerId);

  if (!quest || !player) return res.status(404).json({ error: "Not found" });

  if (quest.completed) {
    return res.json({ message: "This quest is already completed." });
  }

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
  const player = await Player.findById(playerId).populate("activeQuest");
  const quest = player?.activeQuest;

  if (!player || !quest) {
    return res.status(404).json({ error: "No active quest to complete." });
  }

  const meetsDay = player.day >= quest.requirement.day;
  const meetsGpa = player.gpa >= quest.requirement.gpa;

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

    // Check if all quests are completed
    const allQuests = await Quest.find();
    const allCompleted = allQuests.every(q => q.completed);

    let response = {
      message: `${quest.title} completed!`,
      player,
      quest
    };

    // If all quests completed, check win/lose conditions
    if (allCompleted) {
      const gameEndResult = await checkGameEnd(player);
      
      if (gameEndResult.isGameOver) {
        response.gameOver = true;
        response.gameStatus = gameEndResult.status;
        response.message = gameEndResult.message;
      } else {
        response.allQuestsCompleted = true;
        response.message += " All stories have been completed!";
      }
    }

    return res.json(response);
  }

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
