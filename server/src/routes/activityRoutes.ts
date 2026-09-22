import { Router } from "express";
import Activity from "../models/Activity";

const router = Router();

// GET /api/activities/:leadId
router.get("/:leadId", async (req, res) => {
  try {
    const activities = await Activity.find({ leadId: req.params.leadId }).sort({ createdAt: -1 });
    res.json({ data: activities });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

export default router;
