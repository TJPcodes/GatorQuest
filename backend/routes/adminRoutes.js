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

// These routes require:
// 1. protect to verifies a valid JWT (user is logged in)
// 2. adminOnly to ensures the logged-in user has admin privileges

// Player management (admin only)
router.get("/players", protect, adminOnly, adminGetAllPlayers);
router.put("/players/:id", protect, adminOnly, adminUpdatePlayer);
router.delete("/players/:id", protect, adminOnly, adminDeletePlayer);

// User management (admin only)
router.get("/users", protect, adminOnly, adminGetAllUsers);
router.put("/users/:id", protect, adminOnly, adminUpdateUser);
router.delete("/users/:id", protect, adminOnly, adminDeleteUser);

export default router;
