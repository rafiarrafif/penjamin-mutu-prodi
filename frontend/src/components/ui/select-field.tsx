import { useId  } from 'react'
import type {SelectHTMLAttributes} from 'react';

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  options: SelectOption[]
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
}

export function SelectField({
  label,
  options,
  placeholder,
  helperText,
  error,
  required,
  disabled,
  className = '',
  ...props
}: SelectFieldProps) {
  const id = useId()
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const describedBy = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12px] font-semibold text-ink-secondary"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger-text">
            *
          </span>
        )}
      </label>

      <select
        id={id}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy || undefined}
        className={[
          'h-[35px] w-full rounded-[6px] border px-2.5 text-[13px] outline-none transition-shadow',
          disabled
            ? 'border-border-default bg-table-head text-ink-muted cursor-not-allowed'
            : 'border-border-strong bg-surface text-ink-primary focus:border-brand-action focus:ring-3 focus:ring-brand-action/15',
          error ? 'border-danger-text focus:border-danger-text focus:ring-danger-text/15' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1 text-[11.5px] font-medium text-danger-text"
        >
          <span aria-hidden="true" className="font-bold">
            !
          </span>
          <span>{error}</span>
        </p>
      )}

      {helperText && (
        <p id={helperId} className="text-[11.5px] text-ink-muted">
          {helperText}
        </p>
      )}
    </div>
  )
}
