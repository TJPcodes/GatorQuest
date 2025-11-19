import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  adminGetAllPlayers,
  adminUpdatePlayer,
  adminDeletePlayer,
  adminGetAllUsers,
  adminUpdateUser,
  adminDeleteUser
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/players", protect, adminOnly, adminGetAllPlayers);
router.put("/players/:id", protect, adminOnly, adminUpdatePlayer);
router.delete("/players/:id", protect, adminOnly, adminDeletePlayer);

router.get("/users", protect, adminOnly, adminGetAllUsers);
router.put("/users/:id", protect, adminOnly, adminUpdateUser);
router.delete("/users/:id", protect, adminOnly, adminDeleteUser);

export default router;
