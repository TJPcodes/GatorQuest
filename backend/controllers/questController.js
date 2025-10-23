import Quest from "../models/questModel.js";
import Player from "../models/playerModel.js";

export const getQuests = async (req, res) => {
  const quests = await Quest.find();
  res.json(quests);
};

export const startQuest = async (req, res) => {
  const { playerId, questId } = req.body;
  const quest = await Quest.findById(questId);
  const player = await Player.findById(playerId);

  if (!quest || !player) return res.status(404).json({ error: "Not found" });
  if (quest.completed) return res.json({ message: "Quest already completed." });

  res.json({ message: `Quest started: ${quest.title}`, quest });
};

export const completeQuest = async (req, res) => {
  const { playerId, questId } = req.body;
  const quest = await Quest.findById(questId);
  const player = await Player.findById(playerId);

  if (!quest || !player) return res.status(404).json({ error: "Not found" });

  if (player.day >= quest.requirement.day && player.gpa >= quest.requirement.gpa) {
    quest.completed = true;
    player.gpa = Math.min(4.0, player.gpa + quest.reward.gpa);
    player.energy = Math.min(100, player.energy + quest.reward.energy);
    player.social = Math.min(100, player.social + quest.reward.social);
    player.money += quest.reward.money;

    await quest.save();
    await player.save();

    res.json({ message: `${quest.title} completed!`, player, quest });
  } else {
    res.json({ message: "Requirements not met yet." });
  }
};
