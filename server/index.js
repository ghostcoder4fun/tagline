require("dotenv").config();

const express = require("express");
const path = require("path");
const connectDB = require("./db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "https://vertal.vercel.app", // React dev server
  credentials: true
}));
// Connect to DB
connectDB();

app.use(express.json());

// Routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Example API route
app.get("/api/tasks", (req, res) => {
  res.json([
    { id: 1, title: "Label Images", time: "2 min", price: "$0.10" },
    { id: 2, title: "Transcribe Audio", time: "5 min", price: "$0.30" },
  ]);
});

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Catch-all for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
