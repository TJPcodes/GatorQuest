// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import playerRoutes from "./routes/playerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import questRoutes from "./routes/questRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/players", playerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/quests", questRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("GatorQuest backend is running ");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/gatorquest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection failed:", err));

app.get('/', (req, res) => {
  res.send('GatorQuest backend is alive!');
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
