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

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedLeads {
  leads: Lead[];
  pagination: PaginationMeta;
}

export type ImportField = keyof LeadInput;

export interface ImportLeadResult {
  created: Lead[];
  summary: {
    received: number;
    created: number;
    failed: number;
  };
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
];

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 5;
