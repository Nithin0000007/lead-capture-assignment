import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { LEAD_STATUSES, type LeadStatus } from '@/types/lead';
import { statusConfig } from '@/components/StatusBadge';

interface StatusPopoverProps {
  status: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export function StatusPopover({ status, onStatusChange }: StatusPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const config = statusConfig[status];

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full border ${config.classes} transition-all duration-150 hover:shadow-sm cursor-pointer group`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {config.label}
        <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-80 transition-opacity" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/8 py-1 animate-popover-in"
          onClick={(e) => e.stopPropagation()}
        >
          {LEAD_STATUSES.map((s) => {
            const sc = statusConfig[s];
            const isActive = s === status;
            return (
              <button
                key={s}
                onClick={() => {
                  onStatusChange(s);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                <span className="flex-1 text-left">{sc.label}</span>
                {isActive && <Check className="h-3.5 w-3.5 text-teal-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
