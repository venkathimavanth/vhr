const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["monthly_payments", "all_payments", "sip_payments"], required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    nextPayment: { type: Date, required: true },
    amount: { type: Number, required: true, default: 0 },
    note: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
