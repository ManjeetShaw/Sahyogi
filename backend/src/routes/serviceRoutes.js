import { Router } from "express";
import {
  listServices,
  getService,
  createService,
  updateService,
  deleteService,
  saveService,
  unsaveService,
  listSavedServices,
} from "../controllers/serviceController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listServices);
// Must be registered before "/:id" so "saved" isn't parsed as a service id.
router.get("/saved", protect, listSavedServices);
router.get("/:id", getService);

router.post("/", protect, requireRole("admin"), createService);
router.put("/:id", protect, requireRole("admin"), updateService);
router.delete("/:id", protect, requireRole("admin"), deleteService);

router.post("/:id/save", protect, saveService);
router.delete("/:id/save", protect, unsaveService);

export default router;
