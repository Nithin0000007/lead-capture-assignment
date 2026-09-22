import { statusConfig } from '@/components/StatusBadge';
import { LeadStatus } from '@/types/lead';

interface StatusPopoverProps {
  status: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export function StatusPopover({ status, onStatusChange }: StatusPopoverProps) {


  const config = statusConfig[status];

  return (
    <div className="relative inline-block">
      <button
        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full border ${config.classes} transition-all duration-150 hover:shadow-sm cursor-pointer group`}
        onClick={() => onStatusChange(status)}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </button>
    </div>
  );
}
