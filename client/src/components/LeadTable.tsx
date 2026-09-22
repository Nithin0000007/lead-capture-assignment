import { Mail, Phone } from 'lucide-react';
import type { Lead } from '@/types/lead';
import { StatusPopover } from '@/components/StatusPopover';
import { formatRelativeTime, formatFullTimestamp } from '@/lib/format';

interface LeadTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: Lead['status']) => void;
}

export function LeadTable({ leads, onRowClick, onStatusChange }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Email</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Phone</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onRowClick(lead)}
              className="group cursor-pointer transition-colors hover:bg-slate-50/80"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold shrink-0">
                    {lead.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-900 group-hover:text-teal-700 transition-colors">
                    {lead.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-slate-600">{lead.email}</span>
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <span className="text-sm text-slate-600 tabular-nums">{lead.phone}</span>
              </td>
              <td className="px-4 py-3.5">
                <StatusPopover
                  status={lead.status}
                  onStatusChange={(status) => onStatusChange(lead, status)}
                />
              </td>
              <td className="px-4 py-3.5 hidden lg:table-cell">
                <span
                  className="text-sm text-slate-500"
                  title={formatFullTimestamp(lead.createdAt)}
                >
                  {formatRelativeTime(lead.createdAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface LeadCardProps {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: Lead['status']) => void;
}

export function LeadCard({ lead, onCardClick, onStatusChange }: LeadCardProps) {
  return (
    <div
      onClick={() => onCardClick(lead)}
      className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-4 transition-all duration-150 hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold shrink-0">
            {lead.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
              {lead.name}
            </h3>
            <span
              className="text-xs text-slate-400"
              title={formatFullTimestamp(lead.createdAt)}
            >
              {formatRelativeTime(lead.createdAt)}
            </span>
          </div>
        </div>
        <StatusPopover
          status={lead.status}
          onStatusChange={(status) => onStatusChange(lead, status)}
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="tabular-nums">{lead.phone}</span>
        </div>
      </div>
    </div>
  );
}

interface LeadCardListProps {
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: Lead['status']) => void;
}

export function LeadCardList({ leads, onCardClick, onStatusChange }: LeadCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onCardClick={onCardClick}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}


