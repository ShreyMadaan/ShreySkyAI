
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  googleLogin,
  getMe,
  logout,
} from "../controllers/authController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleLogin);

router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

export default router;
