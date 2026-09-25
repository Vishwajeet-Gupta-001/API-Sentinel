import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { acknowledgeIncidentController } from "../controllers/incidentController.js";

const router = express.Router();

router.patch(
  "/:incidentId/acknowledge",
  authMiddleware,
  acknowledgeIncidentController,
);

export default router;
