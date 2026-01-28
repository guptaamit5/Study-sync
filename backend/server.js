// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const summaryRoutes = require("./routes/summary");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Health Check =====
app.get("/", (req, res) => {
  res.send("🟢 StudySync backend is running!");
});

// ===== Routes =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/summary", require("./routes/summary"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/summary", summaryRoutes);

// ===== Protected Test Route (optional) =====
const authMiddleware = require("./middleware/auth");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ msg: "Protected route working", userId: req.user.id });
});

// ===== 404 for unknown API routes =====
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ msg: "API route not found" });
  }
  next();
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ msg: "Server error" });
});

// ===== MongoDB + Server Start =====
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ===== Graceful Shutdown =====
process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing DB...");
  await mongoose.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing DB...");
  await mongoose.disconnect();
  process.exit(0);
});
