import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '#/auth/auth-context'
import { formatRoleLabel, hasMinimumRole } from '#/auth/role'
import { AppShell } from '#/components/layout/app-shell'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'
import { RequireAuth } from './require-auth'

export interface RequireRoleProps {
  requiredRole: string
  breadcrumb?: string
  children: ReactNode
}

export function RequireRole({
  requiredRole,
  breadcrumb = 'Akses Terbatas',
  children,
}: RequireRoleProps) {
  const { role } = useAuth()

  return (
    <RequireAuth>
      {hasMinimumRole(role, requiredRole) ? (
        children
      ) : (
        <AppShell breadcrumb={breadcrumb}>
          <div className="mx-auto max-w-[560px] py-8">
            <Card padding="lg">
              <span className="inline-flex items-center rounded-full bg-danger-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-danger-text">
                403 &middot; Akses Ditolak
              </span>
              <CardTitle className="mt-3 text-[18px]">
                Izin peran tidak mencukupi
              </CardTitle>
              <CardDescription className="mt-1.5">
                Halaman ini memerlukan peran minimal{' '}
                <strong className="text-ink-primary">
                  {formatRoleLabel(requiredRole)}
                </strong>
                . Peran Anda saat ini adalah{' '}
                <strong className="text-ink-primary">
                  {formatRoleLabel(role)}
                </strong>
                . Sesi login Anda tetap aktif.
              </CardDescription>
              <div className="mt-5">
                <Link
                  to="/dashboard"
                  className="inline-flex h-[34px] items-center rounded-[6px] bg-brand-action px-3.5 text-[13px] font-semibold text-white hover:bg-brand-action-hover"
                >
                  Kembali ke Dashboard
                </Link>
              </div>
            </Card>
          </div>
        </AppShell>
      )}
    </RequireAuth>
  )
}
