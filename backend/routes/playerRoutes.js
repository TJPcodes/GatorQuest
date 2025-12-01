import express from "express";
import {
  getPlayers,
  createPlayer,
  study,
  eat,
  rest,
  party,
  workout,
  attendClass,
  attendEvent,
  visitLocation,
  nextDay,
  getPlayerByName
} from "../controllers/playerController.js";

const router = express.Router();


// Basic player CRUD + lookup
router.get("/", getPlayers);
router.post("/", createPlayer);
router.get("/byName/:name", getPlayerByName);

// Player actions that modify stats
router.put("/:id/study", study);
router.put("/:id/eat", eat);
router.put("/:id/rest", rest);
router.put("/:id/party", party);
router.put("/:id/workout", workout);
router.put("/:id/class", attendClass);
router.put("/:id/event", attendEvent);

// Visiting locations applies location-based effects
router.put("/:id/visit", visitLocation);

// Daily progression (duplicate of game route for player-specific flow)
router.post("/:id/next-day", nextDay);


export default router;
