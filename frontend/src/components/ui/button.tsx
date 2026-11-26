import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant =
  | 'action'
  | 'deep'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  children: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  action:
    'bg-brand-action text-white border-transparent hover:bg-brand-action-hover focus-visible:ring-brand-action/30',
  deep: 'bg-brand-deep text-white border-transparent hover:bg-brand-deep-hover focus-visible:ring-brand-deep/30',
  outline:
    'bg-surface text-ink-secondary border-border-strong hover:bg-[#F9FAFB] focus-visible:ring-brand-action/25',
  ghost:
    'bg-transparent text-ink-muted border-transparent hover:bg-surface-subtle hover:text-ink-primary focus-visible:ring-brand-action/20',
  danger:
    'bg-[#D92D20] text-white border-transparent hover:bg-[#B42318] focus-visible:ring-[#D92D20]/30',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[28px] px-2.5 text-[12px] font-medium rounded-[5px]',
  md: 'h-[34px] px-3.5 text-[13px] font-semibold rounded-[6px]',
  lg: 'h-[40px] px-5 text-[13.5px] font-semibold rounded-[6px]',
}

export function Button({
  variant = 'action',
  size = 'md',
  isLoading = false,
  loadingText,
  disabled,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={[
        'inline-flex items-center justify-center gap-1.5 border transition-colors cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-3',
        'disabled:opacity-55 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  )
}
