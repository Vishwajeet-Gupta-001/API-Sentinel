import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/change-password", authMiddleware, changePassword);

export default router;
