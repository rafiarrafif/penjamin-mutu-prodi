import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
  
} from 'react'
import type {ReactNode} from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description: string
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_STYLES: Record<
  ToastVariant,
  { box: string; badge: string; label: string }
> = {
  success: {
    box: 'border-[#ABEFC6] bg-success-soft text-success-text',
    badge: 'bg-success-text text-white',
    label: 'OK',
  },
  error: {
    box: 'border-danger-border bg-danger-soft text-danger-text',
    badge: 'bg-danger-text text-white',
    label: 'ERR',
  },
  warning: {
    box: 'border-[#FEDF89] bg-warning-soft text-warning-text',
    badge: 'bg-warning-text text-white',
    label: 'PERHATIAN',
  },
  info: {
    box: 'border-border-default bg-surface text-ink-primary',
    badge: 'bg-brand-deep text-white',
    label: 'INFO',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev, { ...toast, id }])
      window.setTimeout(() => {
        dismissToast(id)
      }, 6000)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-[380px] flex-col gap-2"
      >
        {toasts.map((item) => {
          const style = TOAST_STYLES[item.variant]
          return (
            <div
              key={item.id}
              role={item.variant === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start justify-between gap-3 rounded-[8px] border p-3.5 shadow-[0_10px_24px_-8px_rgba(15,23,42,0.14)] ${style.box}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${style.badge}`}
                  >
                    {style.label}
                  </span>
                  <p className="text-[13px] font-semibold leading-snug">
                    {item.title}
                  </p>
                </div>
                {item.description && (
                  <p className="mt-1 text-[12px] leading-relaxed opacity-90">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => dismissToast(item.id)}
                className="rounded px-1.5 py-0.5 text-[12px] font-semibold opacity-70 hover:opacity-100 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
