import { useEffect, useRef, useState } from 'react';
import { X, Mail, Phone, User, Clock, Loader2 } from 'lucide-react';
import type { Lead, LeadInput, LeadStatus } from '@/types/lead';
import { LEAD_STATUSES } from '@/types/lead';
import { formatRelativeTime, formatFullTimestamp } from '@/lib/format';

interface LeadDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  lead?: Lead | null;
  onClose: () => void;
  onSubmit: (data: LeadInput) => Promise<void>;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const emptyForm: LeadInput = {
  name: '',
  email: '',
  phone: '',
  status: 'New',
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}

export function LeadDrawer({ open, mode, lead, onClose, onSubmit }: LeadDrawerProps) {
  const [form, setForm] = useState<LeadInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && lead) {
        setForm({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          status: lead.status,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, mode, lead]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      next.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) {
      next.phone = 'Phone is required';
    } else if (!validatePhone(form.phone)) {
      next.phone = 'Please enter a valid phone number (7-15 digits)';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
      });
      onClose();
    } catch {
      // Error toast handled by parent
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
        <div
          ref={panelRef}
          className="pointer-events-auto h-full w-full max-w-md bg-white shadow-2xl shadow-slate-900/10 animate-drawer-in flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              {mode === 'create' ? 'New Lead' : 'Edit Lead'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 rounded-lg hover:bg-slate-50"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              <div>
                <label htmlFor="lead-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="lead-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Smith"
                    className={`w-full h-10 pl-10 pr-3 text-sm bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-4 ${
                      errors.name
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-teal-400 focus:ring-teal-500/10 hover:border-slate-300'
                    }`}
                    autoFocus
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-600 mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="lead-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@company.com"
                    className={`w-full h-10 pl-10 pr-3 text-sm bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-4 ${
                      errors.email
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-teal-400 focus:ring-teal-500/10 hover:border-slate-300'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600 mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="lead-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="lead-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full h-10 pl-10 pr-3 text-sm bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-4 ${
                      errors.phone
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-teal-400 focus:ring-teal-500/10 hover:border-slate-300'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 mt-1.5">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="lead-status" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Status
                </label>
                <select
                  id="lead-status"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value as LeadStatus)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 transition-all duration-150 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 hover:border-slate-300 cursor-pointer"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {mode === 'edit' && lead && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span title={formatFullTimestamp(lead.createdAt)}>
                      Created {formatRelativeTime(lead.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={onClose}
              className="h-9 px-4 text-sm font-medium text-slate-600 rounded-lg transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm shadow-teal-600/20 transition-all duration-150 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Lead' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
