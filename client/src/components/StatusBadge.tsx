import type { LeadStatus } from '@/types/lead';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<LeadStatus, { label: string; classes: string; dot: string }> = {
  New: {
    label: 'New',
    classes: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  },
  Contacted: {
    label: 'Contacted',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  Qualified: {
    label: 'Qualified',
    classes: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  Converted: {
    label: 'Converted',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Lost: {
    label: 'Lost',
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1.5' : 'px-2.5 py-1 text-xs gap-2';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.classes} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export { statusConfig };
