import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { statusConfig } from '@/components/StatusBadge';
import { LEAD_STATUSES } from '@/types/lead';
import type { LeadStatus } from '@/types/lead';

interface StatusPopoverProps {
  status: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export function StatusPopover({ status, onStatusChange }: StatusPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const config = statusConfig[status];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={popoverRef} className="relative inline-block" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full border ${config.classes} transition-all duration-150 hover:shadow-sm cursor-pointer`}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {config.label}
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10">
          {LEAD_STATUSES.map((option) => {
            const optionConfig = statusConfig[option];
            const selected = option === status;

            return (
              <button
                key={option}
                type="button"
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                onClick={() => {
                  setOpen(false);
                  onStatusChange(option);
                }}
                role="menuitem"
              >
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${optionConfig.dot}`} />
                  {optionConfig.label}
                </span>
                {selected && <Check className="h-3.5 w-3.5 text-teal-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
