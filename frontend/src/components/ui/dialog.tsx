import { useEffect, useId  } from 'react'
import type {ReactNode} from 'react';
import { Button  } from './button'
import type {ButtonVariant} from './button';

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: ButtonVariant
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isLoading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-primary/35 p-4"
      onClick={() => {
        if (!isLoading) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[10px] border border-border-default bg-surface p-5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.16)]"
      >
        <h3
          id={titleId}
          className="text-[16px] font-semibold text-ink-primary"
        >
          {title}
        </h3>
        <p
          id={descId}
          className="mt-1.5 text-[13px] leading-relaxed text-ink-muted"
        >
          {description}
        </p>

        {children && <div className="mt-3">{children}</div>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            isLoading={isLoading}
            loadingText="Memproses..."
            onClick={() => {
              void onConfirm()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
