const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["monthly_payments", "all_payments"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    nextPayment: { type: Date, required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
