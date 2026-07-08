import { Router } from "express";
import rateLimit from "express-rate-limit";
import { chat, history, recommend, simplify } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Keep AI calls modest: 20 messages per 10 minutes per user/IP.
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { message: "You're sending messages too quickly. Please wait a bit and try again." },
});

router.use(protect);
router.post("/chat", aiLimiter, chat);
router.get("/history", history);
router.post("/recommend", aiLimiter, recommend);
router.post("/simplify", aiLimiter, simplify);

export default router;
