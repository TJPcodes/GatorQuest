import express from "express";
import { nextDay, getGameStatus, resetGame } from "../controllers/gameController.js";

const router = express.Router();

//  Controls the main progression loop of the game.

// Advance the player's game by one day
router.post("/:id/next-day", nextDay);

// Fetch current game status (stats, day, progression)
router.get("/:id/status", getGameStatus);

// Reset a player's game progress to defaults
router.post("/:id/reset", resetGame);

export default router;
