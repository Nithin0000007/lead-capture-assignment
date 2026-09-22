import { useCallback, useRef, useState } from 'react';
import { ToastProvider, useToast } from '@/components/Toast';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { LeadList } from '@/components/LeadList';
import { LeadDrawer } from '@/components/LeadDrawer';
import { ImportLeadsModal } from '@/components/ImportLeadsModal';
import { useLeads } from '@/hooks/useLeads';
import { parseCsv } from '@/lib/csv';
import type { Lead, LeadInput } from '@/types/lead';

function LeadTrackerApp() {
  const { showToast } = useToast();
  const {
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
    importLeadRows,
  } = useLeads();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importRows, setImportRows] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateDrawer = useCallback(() => {
    setDrawerMode('create');
    setSelectedLead(null);
    setDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((lead: Lead) => {
    setDrawerMode('edit');
    setSelectedLead(lead);
    setDrawerOpen(true);
  }, []);

  const handleDrawerSubmit = useCallback(
    async (data: LeadInput) => {
      if (drawerMode === 'create') {
        await addLead(data);
        showToast('Lead created successfully', 'success');
      } else if (selectedLead) {
        await editLead(selectedLead.id, data);
        showToast('Lead updated successfully', 'success');
      }
    },
    [drawerMode, selectedLead, addLead, editLead, showToast]
  );

  const openImportPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';

      if (!file) return;

      try {
        const parsed = parseCsv(await file.text());
        if (parsed.headers.length === 0 || parsed.rows.length === 0) {
          showToast('CSV file must include headers and at least one row', 'error');
          return;
        }

        setImportFileName(file.name);
        setImportHeaders(parsed.headers);
        setImportRows(parsed.rows);
        setImportOpen(true);
      } catch {
        showToast('Failed to read CSV file', 'error');
      }
    },
    [showToast]
  );

  const handleImportSubmit = useCallback(
    async (rows: LeadInput[]) => {
      const result = await importLeadRows(rows);
      setImportOpen(false);
      showToast(
        `Imported ${result.summary.created} ${result.summary.created === 1 ? 'lead' : 'leads'}`,
        result.summary.failed > 0 ? 'info' : 'success'
      );
    },
    [importLeadRows, showToast]
  );

  const handleStatusChange = useCallback(
    async (lead: Lead, status: Lead['status']) => {
      if (lead.status === status) return;
      try {
        await changeStatus(lead, status);
        showToast(`Status changed to ${status}`, 'success');
      } catch {
        showToast('Failed to update status', 'error');
      }
    },
    [changeStatus, showToast]
  );

  return (
    <div className="min-h-screen bg-slate-50/60">
      <Header
        onNewLead={openCreateDrawer}
        onImportLeads={openImportPicker}
        leadCount={pagination.total}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleImportFileChange}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Pipeline</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading
                ? 'Loading your leads...'
                : `${pagination.total} ${pagination.total === 1 ? 'lead' : 'leads'} in your pipeline`}
            </p>
          </div>
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>

        <LeadList
          leads={leads}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          pagination={pagination}
          onRowClick={openEditDrawer}
          onStatusChange={handleStatusChange}
          onNewLead={openCreateDrawer}
          onRetry={loadLeads}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />

        {!loading && !error && leads.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-6">
            <span className="hidden md:inline">Click a row to edit details · Click a status badge to change it inline</span>
            <span className="md:hidden">Tap a card to edit details · Tap a status badge to change it inline</span>
          </p>
        )}
      </main>

      <LeadDrawer
        open={drawerOpen}
        mode={drawerMode}
        lead={selectedLead}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleDrawerSubmit}
      />
      <ImportLeadsModal
        open={importOpen}
        fileName={importFileName}
        headers={importHeaders}
        rows={importRows}
        onClose={() => setImportOpen(false)}
        onImport={handleImportSubmit}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LeadTrackerApp />
    </ToastProvider>
  );
}
