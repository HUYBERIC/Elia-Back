const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const verifyToken = require("./middleware/authJWT");
const cors = require("cors");
const ServiceCenter = require("./models/ServiceCenter");


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

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Express server is on!");
});

app.get("/testSC",verifyToken, async (req,res) => {
  const userid = req.user.id;
  try {
    const { name, description, location } = req.body;

    // Create a new ServiceCenter document
    const newServiceCenter = new ServiceCenter({
      name,
      description,
      location,
      users:[userid], // Must be an array of ObjectIds
    });

    // Save to MongoDB
    await newServiceCenter.save();
    res.status(201).json(newServiceCenter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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