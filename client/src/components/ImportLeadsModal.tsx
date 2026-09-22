import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { LEAD_STATUSES } from '@/types/lead';
import type { ImportField, LeadInput, LeadStatus } from '@/types/lead';

interface ImportLeadsModalProps {
  open: boolean;
  fileName: string;
  headers: string[];
  rows: string[][];
  onClose: () => void;
  onImport: (rows: LeadInput[]) => Promise<void>;
}

type MappingValue = ImportField | '';
type ColumnMapping = Record<number, MappingValue>;

const FIELD_LABELS: Record<ImportField, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  status: 'Status',
};

const FIELD_OPTIONS: Array<{ value: ImportField; label: string }> = [
  { value: 'name', label: FIELD_LABELS.name },
  { value: 'email', label: FIELD_LABELS.email },
  { value: 'phone', label: FIELD_LABELS.phone },
  { value: 'status', label: FIELD_LABELS.status },
];

const REQUIRED_FIELDS: ImportField[] = ['name', 'email', 'phone'];

function normalizeHeader(header: string) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function inferField(header: string): MappingValue {
  const normalized = normalizeHeader(header);

  if (['name', 'fullname', 'leadname', 'contactname'].includes(normalized)) return 'name';
  if (['email', 'emailaddress', 'mail'].includes(normalized)) return 'email';
  if (['phone', 'phonenumber', 'mobile', 'mobilenumber', 'cell'].includes(normalized)) return 'phone';
  if (['status', 'leadstatus', 'stage'].includes(normalized)) return 'status';

  return '';
}

function initialMapping(headers: string[]): ColumnMapping {
  const used = new Set<ImportField>();

  return headers.reduce<ColumnMapping>((mapping, header, index) => {
    const field = inferField(header);
    if (field && !used.has(field)) {
      mapping[index] = field;
      used.add(field);
    } else {
      mapping[index] = '';
    }
    return mapping;
  }, {});
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeStatus(status: string): LeadStatus | null {
  const match = LEAD_STATUSES.find((option) => option.toLowerCase() === status.trim().toLowerCase());
  return match ?? null;
}

function buildLeadRows(rows: string[][], mapping: ColumnMapping): {
  leads: LeadInput[];
  errors: string[];
} {
  const errors: string[] = [];
  const leads: LeadInput[] = [];
  const mappedFields = new Set(Object.values(mapping).filter(Boolean));

  REQUIRED_FIELDS.forEach((field) => {
    if (!mappedFields.has(field)) {
      errors.push(`${FIELD_LABELS[field]} must be mapped`);
    }
  });

  if (errors.length > 0) {
    return { leads, errors };
  }

  rows.forEach((row, index) => {
    if (row.every((value) => value.trim() === '')) return;

    const draft: Partial<Record<ImportField, string>> = {};
    Object.entries(mapping).forEach(([columnIndex, field]) => {
      if (field) {
        draft[field] = row[Number(columnIndex)]?.trim() ?? '';
      }
    });

    const rowNumber = index + 1;
    if (!draft.name) {
      errors.push(`Row ${rowNumber}: Name is required`);
      return;
    }

    if (!draft.email || !validateEmail(draft.email)) {
      errors.push(`Row ${rowNumber}: Valid email is required`);
      return;
    }

    if (!draft.phone) {
      errors.push(`Row ${rowNumber}: Phone is required`);
      return;
    }

    const status = draft.status ? normalizeStatus(draft.status) : 'New';
    if (!status) {
      errors.push(`Row ${rowNumber}: Status must be New, Contacted, Qualified, Converted, or Lost`);
      return;
    }

    leads.push({
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
      status,
    });
  });

  if (leads.length === 0 && errors.length === 0) {
    errors.push('No importable rows found');
  }

  return { leads, errors };
}

export function ImportLeadsModal({
  open,
  fileName,
  headers,
  rows,
  onClose,
  onImport,
}: ImportLeadsModalProps) {
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMapping(initialMapping(headers));
      setSubmitError(null);
    }
  }, [headers, open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, open]);

  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const preview = useMemo(() => rows[0] ?? [], [rows]);
  const validation = useMemo(() => buildLeadRows(rows, mapping), [mapping, rows]);
  const visibleErrors = validation.errors.slice(0, 4);

  function updateMapping(columnIndex: number, field: MappingValue) {
    setMapping((current) => {
      const next = { ...current, [columnIndex]: field };
      if (field) {
        Object.entries(next).forEach(([index, mappedField]) => {
          if (Number(index) !== columnIndex && mappedField === field) {
            next[Number(index)] = '';
          }
        });
      }
      return next;
    });
  }

  async function handleImport() {
    setSubmitError(null);
    if (validation.errors.length > 0) return;

    setSubmitting(true);
    try {
      await onImport(validation.leads);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to import leads');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Map Headers</h2>
              <p className="mt-1 text-sm text-slate-500">
                {fileName} | {rows.length} {rows.length === 1 ? 'record' : 'records'} | {mappedCount} of {headers.length} columns mapped
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md shadow-slate-900/20 transition-colors hover:bg-slate-700"
              aria-label="Close import modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <p className="mb-5 text-sm text-slate-500">
              Match each column from your file to a lead field. Unmapped columns are ignored on import.
            </p>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="grid grid-cols-[1fr_1fr_1fr] bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white">
                <span>Column Header</span>
                <span>Preview</span>
                <span>Map To Lead Field</span>
              </div>
              {headers.map((header, index) => (
                <div
                  key={`${header}-${index}`}
                  className="grid grid-cols-[1fr_1fr_1fr] items-center gap-4 border-t border-slate-100 px-4 py-3"
                >
                  <span className="truncate text-sm font-semibold text-slate-900">{header || `Column ${index + 1}`}</span>
                  <span className="truncate text-sm text-slate-500">{preview[index] || '-'}</span>
                  <select
                    value={mapping[index] ?? ''}
                    onChange={(event) => updateMapping(index, event.target.value as MappingValue)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                  >
                    <option value="">Do not import</option>
                    {FIELD_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {(visibleErrors.length > 0 || submitError) && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div className="space-y-1 text-sm text-rose-700">
                    {submitError && <p>{submitError}</p>}
                    {visibleErrors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                    {validation.errors.length > visibleErrors.length && (
                      <p>{validation.errors.length - visibleErrors.length} more rows need attention</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={submitting || validation.errors.length > 0}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Import Leads
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
