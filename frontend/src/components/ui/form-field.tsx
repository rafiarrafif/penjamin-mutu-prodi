import {
  useId
  
  
} from 'react'
import type {InputHTMLAttributes, TextareaHTMLAttributes} from 'react';

interface BaseFieldProps {
  label: string
  helperText?: string
  error?: string
  required?: boolean
  locked?: boolean
}

export type FormFieldProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

export function FormField({
  label,
  helperText,
  error,
  required,
  locked,
  disabled,
  readOnly,
  className = '',
  ...props
}: FormFieldProps) {
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

      <input
        id={id}
        required={required}
        disabled={disabled}
        readOnly={readOnly || locked}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy || undefined}
        className={[
          'h-[35px] w-full rounded-[6px] border px-3 text-[13px] outline-none transition-shadow',
          locked || disabled
            ? 'border-border-default bg-table-head text-ink-muted cursor-not-allowed'
            : 'border-border-strong bg-surface text-ink-primary placeholder:text-ink-subtle focus:border-brand-action focus:ring-3 focus:ring-brand-action/15',
          error ? 'border-danger-text focus:border-danger-text focus:ring-danger-text/15' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

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

export type TextareaFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>

export function TextareaField({
  label,
  helperText,
  error,
  required,
  locked,
  disabled,
  readOnly,
  className = '',
  rows = 3,
  ...props
}: TextareaFieldProps) {
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

      <textarea
        id={id}
        rows={rows}
        required={required}
        disabled={disabled}
        readOnly={readOnly || locked}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy || undefined}
        className={[
          'w-full rounded-[6px] border px-3 py-2 text-[13px] outline-none transition-shadow resize-y',
          locked || disabled
            ? 'border-border-default bg-table-head text-ink-muted cursor-not-allowed'
            : 'border-border-strong bg-surface text-ink-primary placeholder:text-ink-subtle focus:border-brand-action focus:ring-3 focus:ring-brand-action/15',
          error ? 'border-danger-text focus:border-danger-text focus:ring-danger-text/15' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

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
