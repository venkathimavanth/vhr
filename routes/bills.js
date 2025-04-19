const express = require("express");
const Bill = require("../models/bills");
const Transaction = require("../models/transactions");

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
    res.status(200).json(newBill);
  } catch (err) {
    res.status(500).json({ message: `Error adding bill - ${err.message}` });
  }
});

// POST: Add a new transaction
router.post("/transaction", async (req, res) => {
  console.log("Updating bill & adding transaction...");
  try {
    const { billId, paymentDate, nextPayment, amount, note } = req.body;

    if (!billId || !paymentDate || !nextPayment || !amount) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    bill.nextPayment = nextPayment;
    bill.amount = amount;
    await bill.save();

    const newTransaction = new Transaction({
      bill: billId,
      date: paymentDate,
      amount,
      note
    });
    await newTransaction.save();

    res.status(200).json({
      message: "Bill updated and transaction added successfully",
      updatedBill: bill,
      transaction: newTransaction
    });
  } catch (err) {
    console.error("Error updating bill & adding transaction:", err);
    res.status(500).json({ message: `Error - ${err.message}` });
  }
});


module.exports = router;
