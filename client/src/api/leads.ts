import { supabase } from '@/lib/supabase';
import type { Lead, LeadInput, LeadStatus } from '@/types/lead';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
  }));
}

export async function getLeads(): Promise<Lead[]> {
  await delay(300);
  return fetchLeads();
}

export async function searchLeads(query: string): Promise<Lead[]> {
  await delay(300);
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
  }));
}

export async function createLead(data: LeadInput): Promise<Lead> {
  await delay(400);
  const { data: row, error } = await supabase
    .from('leads')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
  };
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  await delay(250);
  const { data: row, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
  };
}

export async function updateLead(id: string, data: Partial<LeadInput>): Promise<Lead> {
  await delay(400);
  const { data: row, error } = await supabase
    .from('leads')
    .update({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.status !== undefined && { status: data.status }),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
  };
}
