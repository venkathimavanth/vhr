const express = require("express");
const Bill = require("../models/bills");

const router = express.Router();

// GET: Fetch all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find({ deleted: false });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Add a new bill
router.post("/", async (req, res) => {
  try {
    const { title, type, startDate, endDate, nextPayment, amount, note } = req.body;

    if (!title || !type || !startDate || !endDate || !nextPayment || !amount) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newBill = new Bill({ title, type, startDate, endDate, nextPayment, amount, note });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ message: "Error adding bill" });
  }
});

module.exports = router;
