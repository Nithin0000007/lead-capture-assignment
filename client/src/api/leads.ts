import type { Lead, LeadInput, LeadStatus } from '@/types/lead';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(
  /\/$/,
  ''
);

interface LeadDocument {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

function toLead(row: LeadDocument): Lead {
  return {
    id: row._id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    createdAt: row.createdAt,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as Partial<ApiResponse<T>>;

  if (!response.ok) {
    throw new Error(payload.error ?? 'Request failed');
  }

  if (payload.data === undefined) {
    throw new Error('Invalid API response');
  }

  return payload.data;
}

async function fetchLeads(search?: string): Promise<Lead[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const rows = await request<LeadDocument[]>(`/leads${query}`);
  return rows.map(toLead);
}

export function getLeads(): Promise<Lead[]> {
  return fetchLeads();
}

export function searchLeads(query: string): Promise<Lead[]> {
  return fetchLeads(query);
}

export async function createLead(data: LeadInput): Promise<Lead> {
  const row = await request<LeadDocument>('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return toLead(row);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const row = await request<LeadDocument>(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return toLead(row);
}

export async function updateLead(id: string, data: Partial<LeadInput>): Promise<Lead> {
  const row = await request<LeadDocument>(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  return toLead(row);
}
