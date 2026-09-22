import { Request, Response } from "express";
import Lead from "../models/Lead";

// GET /api/leads?search=xyz
export const getLeads = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search as string, "i");
      query = { $or: [{ name: regex }, { email: regex }, { phone: regex }] };
    }
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json({ data: leads });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// GET /api/leads/:id
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: lead });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lead" });
  }
};

// POST /api/leads
export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, status } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }
    const lead = await Lead.create({ name, email, phone, status });
    res.status(201).json({ data: lead });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: err.message || "Failed to create lead" });
  }
};

// PATCH /api/leads/:id
export const updateLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: lead });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update lead" });
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: { message: "Lead deleted" } });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
};