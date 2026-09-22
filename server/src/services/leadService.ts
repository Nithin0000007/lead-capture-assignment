import Lead, { ILead, LeadStatus } from "../models/Lead";
import { createActivity } from "./activityService";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const findLeadById = async (id: string) => {
  return await Lead.findById(id);
};

// --- Reusable Normalization Helpers ---

const toTitleCase = (str: string) => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const normalizePhone = (phone: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone, 'US');
  return phoneNumber ? phoneNumber.format('E.164') : phone.trim();
};

const normalizeLeadData = (data: { name: string; email: string; phone: string }) => {
  return {
    name: toTitleCase(data.name.trim()),
    email: data.email.trim().toLowerCase(),
    phone: normalizePhone(data.phone.trim())
  };
};

// --- Service Functions ---

export const getLeads = async (query: any, page: number, limit: number) => {
  const total = await Lead.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  const leads = await Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  
  return { leads, total, totalPages, page, limit };
};

export const createLead = async (data: { name: string; email: string; phone: string; status?: LeadStatus }) => {
  const normalizedData = normalizeLeadData(data);
  const lead = await Lead.create({ ...normalizedData, status: data.status || 'New' });
  await createActivity(lead._id, "Created", "Lead created via Dashboard");
  return lead;
};

export const createWebhookLead = async (data: { name: string; email: string; phone: string }) => {
  try {
    const { name, email, phone } = normalizeLeadData(data);
    
    // Deduplication
    let lead = await Lead.findOne({ email });
    
    if (lead) {
      return lead; 
    }
    
    lead = await Lead.create({
      name,
      email,
      phone,
      status: "New",
    });

    await createActivity(lead._id, "Created", "Lead created via Meta Webhook");

    return lead;
  } catch (err) {
    console.error("Webhook Lead Normalization Error:", err);
    throw new Error("Failed to process and normalize incoming lead data.");
  }
};

export const updateLeadStatus = async (id: string, status: LeadStatus) => {
  const oldLead = await Lead.findById(id);
  if (!oldLead) return null;

  const oldStatus = oldLead.status;
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  
  if (lead && oldStatus !== status) {
    await createActivity(lead._id, "StatusChanged", `Status changed to ${status}`, {
      status: { from: oldStatus, to: status }
    });
  }
  return lead;
};

export const updateLead = async (id: string, data: Partial<ILead>) => {
  const oldLead = await Lead.findById(id);
  if (!oldLead) return null;

  // Normalize if name/phone are being updated
  const updateData = { ...data };
  if (updateData.name) updateData.name = toTitleCase(updateData.name.trim());
  if (updateData.phone) updateData.phone = normalizePhone(updateData.phone.trim());

  const changes: Record<string, { from: any; to: any }> = {};
  
  (Object.keys(updateData) as Array<keyof ILead>).forEach((key) => {
    if (updateData[key] !== undefined && updateData[key] !== oldLead[key]) {
      changes[key] = { from: oldLead[key], to: updateData[key] };
    }
  });

  const lead = await Lead.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  
  if (lead && Object.keys(changes).length > 0) {
      await createActivity(lead._id, "Updated", "Lead details updated", changes);
  }
  return lead;
};

export const deleteLead = async (id: string) => {
  return await Lead.findByIdAndDelete(id);
};

export const importLeads = async (leads: Array<{ name: string; email: string; phone: string; status: LeadStatus }>) => {
  const normalizedLeads = leads.map(lead => ({
    ...normalizeLeadData(lead),
    status: lead.status
  }));

  const created = await Lead.insertMany(normalizedLeads, { ordered: false });
  
  await Promise.all(
    created.map(lead => 
      createActivity(lead._id, "Created", "Lead created via CSV Import")
    )
  );

  return created;
};
