import { Router } from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  importLeads,
  updateLead,
  deleteLead,
} from "../controllers/leadController";

const router = Router();

router.get("/", getLeads);
router.post("/", createLead);
router.post("/import", importLeads);
router.get("/:id", getLeadById);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;
