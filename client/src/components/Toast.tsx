import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toastStyles: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-white', border: 'border-emerald-200', text: 'text-emerald-600' },
  error: { icon: AlertCircle, bg: 'bg-white', border: 'border-rose-200', text: 'text-rose-600' },
  info: { icon: Info, bg: 'bg-white', border: 'border-sky-200', text: 'text-sky-600' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 ${style.bg} ${style.border} border rounded-xl shadow-lg shadow-slate-900/5 px-4 py-3 min-w-[280px] max-w-sm animate-toast-in`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${style.text}`} />
              <p className="text-sm font-medium text-slate-700 flex-1">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
