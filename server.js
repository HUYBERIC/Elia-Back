const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "https://eduty-backend.torvalds.be",
  "https://eduty.vercel.app",
  "https://captain.torvalds.be",
];

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

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("OPTIONS validated.");
    return res.sendStatus(200);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Express server is on!");
});

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
