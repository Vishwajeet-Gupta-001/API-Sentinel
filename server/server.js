import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();


app.use(express.json());
app.use("/api/v1/auth", authRoutes);

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
