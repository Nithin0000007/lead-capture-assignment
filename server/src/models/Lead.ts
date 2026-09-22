import mongoose, { Schema, Document } from "mongoose";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  phone: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
    default: "New",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILead>("Lead", LeadSchema);