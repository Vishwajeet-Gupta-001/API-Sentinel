import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import monitorRoutes from "./routes/monitorRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import initializeSubscriber from "./pubsub/pubsubSubscriber.js";

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer);

await initializeSubscriber(io);

io.on("connection", (socket) => {
  console.log("Socket.IO client connected");
});

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/monitors", monitorRoutes);
app.use("/api/v1/incidents", incidentRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

const PORT = process.env.PORT || 5000;

await connectDB();

httpServer.listen(PORT, () => {
  console.log(`API Sentinel server running on port ${PORT}`);
});
