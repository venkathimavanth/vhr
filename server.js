require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define Reminder Schema
const reminderSchema = new mongoose.Schema({
  title: String,
  date: Date,
});

const Reminder = mongoose.model("Reminder", reminderSchema);

// Home Route - Show reminders
app.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.render("index", { reminders });
  } catch (err) {
    res.status(500).send("Error fetching reminders");
  }
});

// Add Reminder Route
app.post("/add-reminder", async (req, res) => {
  const { title, date } = req.body;
  const newReminder = new Reminder({ title, date });

  try {
    await newReminder.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).send("Error saving reminder");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
