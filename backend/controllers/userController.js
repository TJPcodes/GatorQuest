import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_real_secret";
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "An account with this username already exists. Try logging in instead.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both your username and password.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "We couldn't find an account with that username.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
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