const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  bill: { type: mongoose.Schema.Types.ObjectId, ref: "bill", required: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  note: { type: String },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });


const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
