import { Router } from "express";
import {
  listIssues,
  getIssue,
  createIssue,
  updateIssueStatus,
  deleteIssue,
} from "../controllers/issueController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", listIssues);
router.get("/:id", getIssue);
router.post("/", createIssue);
router.patch("/:id/status", requireRole("staff", "admin"), updateIssueStatus);
router.delete("/:id", deleteIssue);

export default router;
