require("dotenv").config();
const  {dbConnection}  = require("./db/database.js");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => res.json({ message: "Spendly API running ✓" }));
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;

dbConnection()
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✓`));


