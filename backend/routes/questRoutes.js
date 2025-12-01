import express from "express";
import { getQuests, startQuest, completeQuest } from "../controllers/questController.js";

const router = express.Router();

// Allows players to view quests, begin a quest, and complete it if requirements are met

// List all quests available in the game
router.get("/", getQuests);

// Start a quest (assigns quest to player's activeQuest)
router.post("/start", startQuest);

// Attempt to complete the active quest (checks requirements + rewards)
router.post("/complete", completeQuest);

export default router;
