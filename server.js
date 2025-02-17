const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",  // Local front-end
  "https://eduty-backend.torvalds.be/", // Back-end fetch
  "https://eduty.vercel.app", // Vercel link
  "https://captain.torvalds.be" // Caprover Link
];


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

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Permet l'envoi des cookies et des headers sécurisés
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// Debugg

app.use((req, res, next) => {
  console.log("➡️ Nouvelle requête:", req.method, req.url);
  console.log("📡 Headers:", req.headers);
  console.log("📦 Body reçu:", req.body);
  next();
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