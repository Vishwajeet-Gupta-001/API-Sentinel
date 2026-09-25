import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  acknowledgeIncidentController,
  getIncidentsController,
  getIncidentController,
} from "../controllers/incidentController.js";

const router = express.Router();

router.get("/", authMiddleware, getIncidentsController);
router.get("/:incidentId", authMiddleware, getIncidentController);

router.patch(
  "/:incidentId/acknowledge",
  authMiddleware,
  acknowledgeIncidentController,
);

export default router;
