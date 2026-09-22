import { useCallback, useEffect, useRef, useState } from 'react';
import { getLeads, searchLeads, createLead, updateLeadStatus, updateLead } from '@/api/leads';
import type { Lead, LeadInput, LeadStatus } from '@/types/lead';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const performSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchLeads(query);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (query.trim() === '') {
          loadLeads();
        } else {
          performSearch(query.trim());
        }
      }, 300);
    },
    [loadLeads, performSearch]
  );

  const addLead = useCallback(async (data: LeadInput): Promise<Lead> => {
    const newLead = await createLead(data);
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  const changeStatus = useCallback(async (lead: Lead, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status } : l))
    );
    try {
      const updated = await updateLeadStatus(lead.id, status);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
    } catch (err) {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
      throw err;
    }
  }, []);

  const editLead = useCallback(async (id: string, data: Partial<LeadInput>): Promise<Lead> => {
    const updated = await updateLead(id, data);
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return {
    leads,
    loading,
    error,
    searchQuery,
    handleSearchChange,
    loadLeads,
    addLead,
    changeStatus,
    editLead,
  };
}
