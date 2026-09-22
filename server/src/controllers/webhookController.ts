import { Request, Response } from "express";
import { createWebhookLead } from "../services/leadService";

export const handleMetaWebhook = async (req: Request, res: Response) => {
  try {
    // Basic validation of incoming webhook data shape
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing required lead fields" });
    }

    const lead = await createWebhookLead(req.body);
    res.status(201).json({ data: lead });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to process webhook" });
  }
};
