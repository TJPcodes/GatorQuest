import express from "express";
import {
  getPlayers,
  createPlayer,
  study,
  eat,
  rest,
  party,
  workout,
  attendClass
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", getPlayers);
router.post("/", createPlayer);
router.put("/:id/study", study);
router.put("/:id/eat", eat);
router.put("/:id/rest", rest);
router.put("/:id/party", party);
router.put("/:id/workout", workout);
router.put("/:id/class", attendClass);

export default router;

