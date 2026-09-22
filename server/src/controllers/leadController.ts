import { Request, Response } from "express";
import Lead from "../models/Lead";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

function parsePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/leads?search=xyz&page=1&limit=5
export const getLeads = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const requestedPage = parsePositiveInteger(req.query.page, 1);
    const requestedLimit = parsePositiveInteger(req.query.limit, 5);
    const limit = PAGE_SIZE_OPTIONS.includes(requestedLimit) ? requestedLimit : 5;
    let query = {};
    if (typeof search === "string" && search.trim()) {
      const regex = new RegExp(escapeRegExp(search.trim()), "i");
      query = { $or: [{ name: regex }, { email: regex }, { phone: regex }] };
    }

    const total = await Lead.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const page = Math.min(requestedPage, totalPages || 1);
    const skip = (page - 1) * limit;
    const leads = await Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
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
