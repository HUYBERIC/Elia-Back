const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const verifyToken = require("./middleware/authJWT");
const cors = require("cors");

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Import MongoDB connection

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion to MongoDB
connectDB();

// Middleware JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true , origin: "*" }));

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Express server is on!");
});

// Launch server
app.listen(PORT, () => {
  console.log(`🚀 Server launch on http://localhost:${PORT}`);
});

// Routes import
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const DutyRoutes = require("./routes/DutyRoutes");
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/duties", DutyRoutes);