import type { ReactNode } from 'react'

export function InfoBanner({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[6px] bg-surface-subtle px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-secondary ${className}`}
    >
      {title && (
        <strong className="mb-0.5 block text-[12px] font-semibold text-ink-primary">
          {title}
        </strong>
      )}
      <div>{children}</div>
    </div>
  )
}

export function DangerBanner({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="alert"
      className={`rounded-[6px] border border-danger-border bg-danger-soft px-3.5 py-2.5 text-[12.5px] leading-relaxed text-danger-text ${className}`}
    >
      {title && (
        <strong className="mb-0.5 block text-[12px] font-semibold">
          ! {title}
        </strong>
      )}
      <div>{children}</div>
    </div>
  )
}

export function SuccessBanner({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="status"
      className={`rounded-[6px] border border-[#ABEFC6] bg-success-soft px-3.5 py-2.5 text-[12.5px] leading-relaxed text-success-text ${className}`}
    >
      {title && (
        <strong className="mb-0.5 block text-[12px] font-semibold">
          [OK] {title}
        </strong>
      )}
      <div>{children}</div>
    </div>
  )
}
