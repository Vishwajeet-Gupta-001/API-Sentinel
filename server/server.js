import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import monitorRoutes from "./routes/monitorRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { startMonitoringScheduler } from "./scheduler/monitoringScheduler.js";
import initializeSubscriber from "./pubsub/pubsubSubscriber.js";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost",
      "https://api-sentinel-frontend-0j9o.onrender.com",
    ],
  }),
);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost",
      "https://api-sentinel-frontend-0j9o.onrender.com",
    ],
  },
});

await initializeSubscriber(io);

io.on("connection", (socket) => {
  console.log("Socket.IO client connected");
});

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/monitors", monitorRoutes);
app.use("/api/v1/incidents", incidentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

const PORT = process.env.PORT || 5000;

await connectDB();

await startMonitoringScheduler();

httpServer.listen(PORT, () => {
  console.log(`API Sentinel server running on port ${PORT}`);
});
