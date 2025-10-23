import express from "express";
import { getQuests, startQuest, completeQuest } from "../controllers/questController.js";

const router = express.Router();

router.get("/", getQuests);
router.post("/start", startQuest);
router.post("/complete", completeQuest);

export default router;
