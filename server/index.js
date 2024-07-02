const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(morgan('common'))

const User = require("./models/Users");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", require("./routes"));

// MongoDB connection
const DBURI = process.env.MONGO_URI;

const createInitialRootUser = async () => {
  const userName = "root";
  const passWord = "125";
  const role = "root";

  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      console.log("Root user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(passWord, 10);
    const rootUser = new User({
      userName,
      passWord: hashedPassword,
      role,
    });
    await rootUser.save();
    console.log("Initial root user account created");
  } catch (err) {
    console.error(err.message);
  }
};

mongoose
  .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Database Connected...");
    await createInitialRootUser();
  })
  .catch((err) => console.error("Database connection error:", err));

// Global Error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});
