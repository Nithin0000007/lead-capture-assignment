import { Request, Response } from "express";
import Lead, { LeadStatus } from "../models/Lead";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];
const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Converted", "Lost"];

interface ImportLeadRow {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  status?: unknown;
}

function parsePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isValidStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.includes(value as LeadStatus);
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

// POST /api/leads/import
export const importLeads = async (req: Request, res: Response) => {
  try {
    const rows: ImportLeadRow[] = Array.isArray(req.body?.leads) ? req.body.leads : [];

    if (rows.length === 0) {
      return res.status(400).json({ error: "At least one lead is required" });
    }

    const errors: Array<{ row: number; error: string }> = [];
    const validLeads: Array<{ name: string; email: string; phone: string; status: LeadStatus }> = [];
    const seenEmails = new Set<string>();

    rows.forEach((row, index) => {
      const rowNumber = index + 1;
      const name = String(row?.name ?? "").trim();
      const email = String(row?.email ?? "").trim().toLowerCase();
      const phone = String(row?.phone ?? "").trim();
      const statusValue = String(row?.status ?? "New").trim() || "New";

      if (!name) {
        errors.push({ row: rowNumber, error: "Name is required" });
        return;
      }

      if (!email || !isValidEmail(email)) {
        errors.push({ row: rowNumber, error: "Valid email is required" });
        return;
      }

      if (!phone) {
        errors.push({ row: rowNumber, error: "Phone is required" });
        return;
      }

      if (!isValidStatus(statusValue)) {
        errors.push({ row: rowNumber, error: "Status is invalid" });
        return;
      }

      if (seenEmails.has(email)) {
        errors.push({ row: rowNumber, error: "Duplicate email in import file" });
        return;
      }

      seenEmails.add(email);
      validLeads.push({ name, email, phone, status: statusValue });
    });

    const created = validLeads.length > 0 ? await Lead.insertMany(validLeads, { ordered: false }) : [];

    res.status(201).json({
      data: {
        created,
        summary: {
          received: rows.length,
          created: created.length,
          failed: errors.length,
        },
        errors,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to import leads" });
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
