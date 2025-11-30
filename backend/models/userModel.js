import mongoose from "mongoose";

// Stores authentication and role-based access data.
// Each user can register/login and may have different permissions

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // Securely stored hashed password (never plain text)
  passwordHash: { type: String, required: true },
  role: {
  // Role determines access to admin routes
  type: String, 
  enum: ["player", "admin"], 
  default: "player" 
}
}, { timestamps: true });   // Automatically adds createdAt + updatedAt


// Users stored in the 'users' collection
const User = mongoose.model("User", userSchema);

export default User;