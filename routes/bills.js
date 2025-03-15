const express = require("express");
const Bill = require("../models/bills");

const router = express.Router();

// GET: Fetch all bills
router.get("/", async (req, res) => {
  console.log("GET bills list");
  try {
    const { type } = req.query;
    const filter = { deleted: false };
    if (type) {
      filter.type = type;
    }
    const bills = await Bill.find(filter).sort({ nextPayment: 1 });;
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Add a new bill
router.post("/", async (req, res) => {
  console.log("Post bill");
  try {
    const { title, type, startDate, endDate, nextPayment, amount, note } = req.body;

    if (!title || !type || !nextPayment || !amount) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newBill = new Bill({ title, type, startDate, endDate, nextPayment, amount, note });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ message: `Error adding bill - ${err.message}` });
  }
});

module.exports = router;
