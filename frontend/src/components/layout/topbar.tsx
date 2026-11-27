import { useState } from 'react'
import { useAuth } from '#/auth/auth-context'
import { formatRoleLabel } from '#/auth/role'
import { Button } from '#/components/ui/button'

export interface TopbarProps {
  breadcrumb: string
  onOpenMobileNav: () => void
}

export function Topbar({ breadcrumb, onOpenMobileNav }: TopbarProps) {
  const { account, role, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const initials = (account?.fullname || 'U')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between gap-3 border-b border-border-default bg-surface px-4 lg:px-7">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Buka menu navigasi"
          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border-default bg-surface text-ink-secondary hover:bg-surface-subtle lg:hidden cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 4.5H13.5M2.5 8H13.5M2.5 11.5H13.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="truncate text-[12.5px] text-ink-muted">
          SIMUTU / <strong className="font-semibold text-ink-primary">{breadcrumb}</strong>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {account && (
          <div className="hidden items-center gap-2 sm:flex">
            {account.profilePicture ? (
              <img
                src={account.profilePicture}
                alt={account.fullname}
                className="h-7 w-7 rounded-full border border-border-default object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="grid h-7 w-7 place-items-center rounded-full border border-border-tinted bg-surface-tinted text-[11px] font-bold text-brand-deep"
              >
                {initials}
              </div>
            )}
            <div className="text-right leading-tight">
              <div className="max-w-[160px] truncate text-[12.5px] font-medium text-ink-primary">
                {account.fullname}
              </div>
              <div className="text-[11px] text-ink-muted">
                {formatRoleLabel(role)}
              </div>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          isLoading={isLoggingOut}
          loadingText="Keluar..."
          onClick={() => {
            void handleLogout()
          }}
        >
          Keluar
        </Button>
      </div>
    </header>
  )
}
