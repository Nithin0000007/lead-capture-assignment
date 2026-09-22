import { UserPlus, SearchX, Inbox } from 'lucide-react';
import type { Lead } from '@/types/lead';
import { LeadTable, LeadCardList } from '@/components/LeadTable';

interface LeadListProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRowClick: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: Lead['status']) => void;
  onNewLead: () => void;
  onRetry: () => void;
}

function SkeletonTable() {
  return (
    <div className="overflow-x-auto">
      <div className="space-y-0">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200">
          {[80, 120, 100, 80, 60].map((w, i) => (
            <div key={i} className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3" style={{ width: 180 }}>
              <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: 80 }} />
            </div>
            <div className="h-3 bg-slate-100 rounded animate-pulse flex-1 max-w-[200px]" />
            <div className="h-3 bg-slate-100 rounded animate-pulse hidden md:block" style={{ width: 120 }} />
            <div className="h-6 bg-slate-100 rounded-full animate-pulse" style={{ width: 90 }} />
            <div className="h-3 bg-slate-100 rounded animate-pulse hidden lg:block" style={{ width: 70 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: 100 }} />
                <div className="h-2.5 bg-slate-100 rounded animate-pulse" style={{ width: 60 }} />
              </div>
            </div>
            <div className="h-6 bg-slate-100 rounded-full animate-pulse" style={{ width: 80 }} />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: '80%' }} />
            <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LeadList({
  leads,
  loading,
  error,
  searchQuery,
  onRowClick,
  onStatusChange,
  onNewLead,
  onRetry,
}: LeadListProps) {
  if (loading) {
    return (
      <>
        <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <SkeletonTable />
        </div>
        <div className="md:hidden">
          <SkeletonCards />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-50 mb-4">
            <Inbox className="h-6 w-6 text-rose-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Something went wrong</h3>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (leads.length === 0 && searchQuery.trim() === '') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 sm:p-16">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 mb-5">
            <UserPlus className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1.5">No leads yet</h3>
          <p className="text-sm text-slate-500 mb-5">
            Get started by creating your first lead. Track contacts, manage status, and move deals through your pipeline.
          </p>
          <button
            onClick={onNewLead}
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm shadow-teal-600/20 transition-all duration-150 hover:bg-teal-700 active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Create your first lead
          </button>
        </div>
      </div>
    );
  }

  if (leads.length === 0 && searchQuery.trim() !== '') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-50 mb-4">
            <SearchX className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">No results found</h3>
          <p className="text-sm text-slate-500">
            No leads match "<span className="font-medium text-slate-700">{searchQuery}</span>". Try a different search term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <LeadTable leads={leads} onRowClick={onRowClick} onStatusChange={onStatusChange} />
      </div>
      <div className="md:hidden">
        <LeadCardList leads={leads} onCardClick={onRowClick} onStatusChange={onStatusChange} />
      </div>
    </>
  );
}
