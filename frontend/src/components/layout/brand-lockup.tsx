import { Link } from '@tanstack/react-router'

export function BrandLockup({
  to = '/',
  subtitle = 'Penjaminan Mutu Prodi',
}: {
  to?: '/' | '/dashboard' | '/login'
  subtitle?: string
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2.5 text-ink-primary no-underline"
    >
      <div
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-brand-deep text-[13px] font-bold text-white"
      >
        S
      </div>
      <div className="leading-tight">
        <div className="text-[14px] font-bold tracking-[-0.02em] text-ink-primary">
          SIMUTU
        </div>
        <div className="text-[10.5px] text-ink-muted">{subtitle}</div>
      </div>
    </Link>
  )
}
