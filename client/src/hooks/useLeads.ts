import { useCallback, useEffect, useRef, useState } from 'react';
import { getLeads, searchLeads, createLead, updateLeadStatus, updateLead } from '@/api/leads';
import { DEFAULT_PAGE_SIZE } from '@/types/lead';
import type { Lead, LeadInput, LeadStatus, PaginationMeta } from '@/types/lead';

const initialPagination: PaginationMeta = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = activeSearch
        ? await searchLeads(activeSearch, { page, limit })
        : await getLeads({ page, limit });
      setLeads(result.leads);
      setPagination(result.pagination);
      setPage(result.pagination.page);
      setLimit(result.pagination.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [activeSearch, limit, page]);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setPage(1);
        setActiveSearch(query.trim());
      }, 300);
    },
    []
  );

  const addLead = useCallback(async (data: LeadInput): Promise<Lead> => {
    const newLead = await createLead(data);
    setPage(1);
    try {
      const result = activeSearch
        ? await searchLeads(activeSearch, { page: 1, limit })
        : await getLeads({ page: 1, limit });
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch {
      setLeads((prev) => [newLead, ...prev].slice(0, limit));
    }
    return newLead;
  }, [activeSearch, limit]);

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

  const changePage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const changePageSize = useCallback((nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return {
    leads,
    loading,
    error,
    searchQuery,
    pagination,
    handleSearchChange,
    changePage,
    changePageSize,
    loadLeads,
    addLead,
    changeStatus,
    editLead,
  };
}
