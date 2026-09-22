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
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {config.label}
        {/* <ChevronDown className="h-3 w-3" /> */}
      </button>

    </div>
  );
}
