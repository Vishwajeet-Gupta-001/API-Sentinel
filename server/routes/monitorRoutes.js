import express from "express";
import {
  createMonitor,
  getMonitors,
  getMonitor,
  updateMonitor,
  deleteMonitor,
  enableMonitor,
  disableMonitor,
  getMonitorStatus,
  getCheckHistory
} from "../controllers/monitorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createMonitor);
router.get("/", authMiddleware, getMonitors);
router.get("/:monitorId", authMiddleware, getMonitor);
router.put("/:monitorId", authMiddleware, updateMonitor);
router.delete("/:monitorId", authMiddleware, deleteMonitor);
router.patch("/:monitorId/enable", authMiddleware, enableMonitor);
router.patch("/:monitorId/disable", authMiddleware, disableMonitor);
router.get("/:monitorId/status", authMiddleware, getMonitorStatus);
router.get("/:monitorId/checks", authMiddleware, getCheckHistory);

export default router;
