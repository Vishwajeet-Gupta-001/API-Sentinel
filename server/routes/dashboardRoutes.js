import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getDashboardSummary, getDashboardAnalytics } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/analytics", authMiddleware, getDashboardAnalytics);

export default router;
