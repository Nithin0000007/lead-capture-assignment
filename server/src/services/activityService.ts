import Activity, { ActivityAction } from "../models/Activity";
import { Types } from "mongoose";

export const createActivity = async (
  leadId: Types.ObjectId | string,
  action: ActivityAction,
  details: string,
  changes?: Record<string, { from: any; to: any }>
) => {
  return await Activity.create({ leadId, action, details, changes });
};
