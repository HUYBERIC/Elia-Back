require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Importation de la connexion MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion to MongoDB
connectDB();

// Middleware JSON
app.use(express.json());

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

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
