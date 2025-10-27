import express from "express";
import { nextDay, getGameStatus, resetGame } from "../controllers/gameController.js";

const router = express.Router();

router.post("/:id/next-day", nextDay);

router.get("/:id/status", getGameStatus);

router.post("/:id/reset", resetGame);

export default router;
