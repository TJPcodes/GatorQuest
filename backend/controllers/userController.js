import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

// Secret used for signing JWT tokens (fallback prevents crashes in dev)
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_real_secret";

// USER REGISTRATION
// Creates a new account with a secure hashed password.
// Validates strong password rules and prevents duplicate accounts.
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic field validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both an username and a password to register.",
      });
    }

    // Password validation: min 12 chars, uppercase, lowercase, and special character
    if (password.length < 12) {
      return res.status(400).json({
        message: "Password must be at least 12 characters long.",
      });
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasSpecialChar) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
      });
    }

    // Prevent duplicate accounts by checking existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "An account with this username already exists. Try logging in instead.",
      });
    }

    // Hashing the user's password for secure storage
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user document
    const user = new User({ email, passwordHash });
    await user.save();

    return res.status(201).json({
      message: "Registration successful! You can now log in.",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
};


//USER LOGIN
// Authenticates a user using bcrypt and returns a signed JWT.
// The JWT includes role + ID and lasts for 7 days.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both your username and password.",
      });
    }

    // Lookup user account
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "We couldn't find an account with that username.",
      });
    }

    // Compare raw password to stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    // JWT payload stores key identity + authorization info
    const payload = { sub: user._id, email: user.email, role: user.role };
    // Issue a long-lived authentication token (7 days)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Something went wrong while logging in. Please try again later.",
    });
  }
};