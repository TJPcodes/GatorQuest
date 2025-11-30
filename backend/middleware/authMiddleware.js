import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_real_secret";


// Verifies that the incoming request includes a valid JWT token.
// If valid, attaches the full user object (minus passwordHash) to req.user.
// This middleware protects any route that requires a logged-in user.

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    // Check for the presence of a Bearer token in headers
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Extract the token value after "Bearer "
    const token = auth.split(" ")[1];

    // Decode & verify the JWT signature and payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Load the associated user and remove sensitive fields
    const user = await User.findById(decoded.sub).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // IMPORTANT: user.role becomes available
    next(); // Allow the request to proceed
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
