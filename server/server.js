import express from "express";

const app = express();

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

app.listen(5000, () => {
  console.log("API Sentinel server running on port 5000");
});
