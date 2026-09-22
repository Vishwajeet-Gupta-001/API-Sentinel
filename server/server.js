import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`API Sentinel server running on port ${PORT}`);
});
