import { useState  } from 'react'
import type {ReactNode} from 'react';
import { useAuth } from '#/auth/auth-context'
import { formatRoleLabel } from '#/auth/role'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export interface AppShellProps {
  breadcrumb: string
  children: ReactNode
}

export function AppShell({ breadcrumb, children }: AppShellProps) {
  const { role } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas text-ink-primary">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          breadcrumb={breadcrumb}
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col gap-4 px-4 py-5 lg:px-7">
          {children}
        </main>

        <footer className="border-t border-border-default bg-surface px-4 py-3 text-[12px] text-ink-muted lg:px-7">
          <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-2">
            <span>SIMPATI &middot; Sistem Penjaminan Mutu Program Studi</span>
            <span>Peran aktif: {formatRoleLabel(role)}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
