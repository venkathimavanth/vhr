const express = require("express");
const Bill = require("../models/bills");
const Transaction = require("../models/transactions");
const dayjs = require('dayjs');

const router = express.Router();

function getMonthDateRange(monthYearStr) {
  const start = dayjs(monthYearStr).startOf('month').toDate();
  const end = dayjs(monthYearStr).endOf('month').toDate();
  return { start, end };
}

// GET: Fetch all bills
router.get("/by-month", async (req, res) => {
  console.log("GET analysis by month");
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'Month is required, e.g. Apr 2025' });

  const { start, end } = getMonthDateRange(month);

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          deleted: false,
          date: { $gte: start, $lte: end },
        }
      },
      {
        $project: {
          _id: 0,
          amount: 1,
          bill: "$bill"
        }
      },
      {
        $lookup: {
          from: "bills",
          localField: "bill",
          foreignField: "_id",
          as: "bill",
        }
      },
      {
        $unwind: {
          path: "$bill",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          amount: 1,
          billType: "$bill.type"
        }
      },
      {
        $group: {
          _id: "$billType",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          billType: "$_id",
          total: 1
        }
      }
    ]);

    const totalSpend = result.reduce((acc, cur) => acc + cur.total, 0);

    res.json({
      totalSpend,
      typeWiseSpend: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Aggregation error' });
  }
});



module.exports = router;
