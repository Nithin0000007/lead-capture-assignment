export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
];
