const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./db");
const billRoutes = require("./routes/bills");
const analysisRoutes = require("./routes/analysis");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/bills", billRoutes);
app.use("/analysis", analysisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
