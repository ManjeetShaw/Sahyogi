import { Router } from "express";
import {
  listServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listServices);
router.get("/:id", getService);

router.post("/", protect, requireRole("admin"), createService);
router.put("/:id", protect, requireRole("admin"), updateService);
router.delete("/:id", protect, requireRole("admin"), deleteService);

export default router;
