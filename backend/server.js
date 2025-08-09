const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const path = require("path");
const https = require("https");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL.replace(/\/$/, ""),
      "http://192.168.82.139:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", authRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "certs/192.168.82.139-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/192.168.82.139.pem")),
  },
  app
);
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
