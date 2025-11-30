import express from "express";
import { register, login } from "../controllers/userController.js";

const router = express.Router();

// Handles account creation and login.
// No authentication is required for these routes because they produce tokens.

// Create a new user account
router.post("/register", register);

// Authenticate a user and return a JWT token
router.post("/login", login);

export default router;