import { Users, Plus } from 'lucide-react';

interface HeaderProps {
  onNewLead: () => void;
  leadCount?: number;
}

export function Header({ onNewLead, leadCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm shadow-teal-500/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-900 tracking-tight">Lead Tracker</h1>
              {leadCount !== undefined && leadCount > 0 && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-md">
                  {leadCount} {leadCount === 1 ? 'lead' : 'leads'}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onNewLead}
            className="inline-flex items-center gap-2 h-9 px-3.5 sm:px-4 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm shadow-teal-600/20 transition-all duration-150 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-600/25 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Lead</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
