const cookieParser = require("cookie-parser");
const cookie = require("cookie");
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
app.use(cors({ credentials: true , origin: "http://localhost:5173" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

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
const utilsRoutes = require("./routes/utilsRoute");
const requestRoutes = require("./routes/requestsRoute");
const replacementsRoutes = require("./routes/replacementsRoute");
const notFoundRoute = require("./routes/notFoundRoute");

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/duties", DutyRoutes);
app.use("/api/utils", utilsRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/replacements", replacementsRoutes);
app.use("*", notFoundRoute);