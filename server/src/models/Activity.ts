import mongoose, { Schema, Document, Types } from "mongoose";

export type ActivityAction = "Created" | "Updated" | "StatusChanged";

export interface IActivity extends Document {
  leadId: Types.ObjectId;
  action: ActivityAction;
  details: string;
  changes?: Record<string, { from: any; to: any }>; // Detailed field changes
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
  action: {
    type: String,
    enum: ["Created", "Updated", "StatusChanged"],
    required: true,
  },
  details: { type: String, required: true },
  changes: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IActivity>("Activity", ActivitySchema);
