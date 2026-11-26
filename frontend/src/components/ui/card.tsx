import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'tinted' | 'subtle' | 'danger'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

const VARIANT_STYLES = {
  default: 'bg-surface border border-border-default',
  tinted: 'bg-surface-tinted border border-border-tinted',
  subtle: 'bg-surface-subtle border border-transparent',
  danger: 'bg-danger-soft border border-danger-border text-danger-text',
}

const PADDING_STYLES = {
  none: '',
  sm: 'p-3',
  md: 'px-5 py-4',
  lg: 'p-6',
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-[8px]',
        VARIANT_STYLES[variant],
        PADDING_STYLES[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <h2
      className={`text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-ink-primary ${className}`}
    >
      {children}
    </h2>
  )
}

export function CardDescription({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p className={`text-[12.5px] leading-relaxed text-ink-muted ${className}`}>
      {children}
    </p>
  )
}
