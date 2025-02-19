const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Import MongoDB connection

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connexion MongoDB
connectDB();

// ✅ Liste des origins autorisés
const allowedOrigins = [
  "http://localhost:3000",
  "https://eduty-backend.torvalds.be",
  "https://eduty.vercel.app",
  "https://captain.torvalds.be",
];

// ✅ Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔥 Appliquer CORS une seule fois
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Gérer le preflight

// ✅ Middleware JSON & Cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Debug Request Logger
app.use((req, res, next) => {
  console.log("➡️ Nouvelle requête:", req.method, req.url);
  console.log("📡 Origin:", req.headers.origin);
  console.log("📦 Body reçu:", req.body);
  console.log("rico");

  next();
}); 

// ✅ Vérification des preflight requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("⚡ OPTIONS request captée !");
    return res.sendStatus(200);
  }
  next();
});

// ✅ Route de test
app.get("/", (req, res) => {
  res.send("🚀 Express server is on!");
});

// ✅ Routes import
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const DutyRoutes = require("./routes/DutyRoutes");
const utilsRoutes = require("./routes/utilsRoute");
const requestRoutes = require("./routes/requestsRoute");
const replacementsRoutes = require("./routes/replacementsRoute");
const notFoundRoute = require("./routes/notFoundRoute");

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/duties", DutyRoutes);
app.use("/api/utils", utilsRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/replacements", replacementsRoutes);
app.use("*", notFoundRoute);

// ✅ Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
