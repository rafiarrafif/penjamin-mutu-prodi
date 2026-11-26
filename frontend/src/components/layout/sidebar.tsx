import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '#/auth/auth-context'
import {
  canApproveProvision,
  canManageAccounts,
  canManageCategories,
  canManageDepartments,
  formatRoleLabel,
} from '#/auth/role'
import { BrandLockup } from './brand-lockup'

interface NavItem {
  label: string
  to:
    | '/dashboard'
    | '/profile'
    | '/admin/categories'
    | '/admin/departments'
    | '/admin/accounts'
    | '/director/provisions'
  visible: boolean
}

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { account, role } = useAuth()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const groups: { title: string; items: NavItem[] }[] = [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', to: '/dashboard', visible: true },
        { label: 'Profil Saya', to: '/profile', visible: true },
      ],
    },
    {
      title: 'Manajemen',
      items: [
        {
          label: 'Kategori Data',
          to: '/admin/categories',
          visible: canManageCategories(role),
        },
        {
          label: 'Departemen',
          to: '/admin/departments',
          visible: canManageDepartments(role),
        },
        {
          label: 'Akun Pengguna',
          to: '/admin/accounts',
          visible: canManageAccounts(role),
        },
      ],
    },
    {
      title: 'Direktur',
      items: [
        {
          label: 'Persetujuan Provisi',
          to: '/director/provisions',
          visible: canApproveProvision(role),
        },
      ],
    },
  ]

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.visible),
    }))
    .filter((group) => group.items.length > 0)

  const sidebarBody = (
    <div className="flex h-full flex-col gap-3.5 bg-surface px-3 py-3.5">
      <div className="px-1.5 py-0.5">
        <BrandLockup to="/dashboard" subtitle="Penjaminan Mutu" />
      </div>

      {account && (
        <div className="rounded-[8px] border border-border-tinted bg-surface-tinted px-3 py-2.5">
          <div className="truncate text-[12.5px] font-semibold text-ink-primary">
            {account.fullname}
          </div>
          <div className="truncate text-[11px] text-ink-muted">
            {account.email}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold text-ink-secondary">
              {formatRoleLabel(role)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                account.isVerified
                  ? 'bg-success-soft text-success-text'
                  : 'bg-warning-soft text-warning-text'
              }`}
            >
              {account.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
            </span>
          </div>
        </div>
      )}

      <nav aria-label="Navigasi Utama" className="flex flex-col gap-3.5">
        {visibleGroups.map((group) => (
          <div key={group.title}>
            <div className="mb-1 px-2 text-[10.5px] font-bold uppercase tracking-[0.06em] text-ink-subtle">
              {group.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.to || pathname.startsWith(`${item.to}/`)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={[
                      'flex h-[34px] items-center rounded-[6px] px-2.5 text-[13px] transition-colors no-underline',
                      isActive
                        ? 'bg-nav-active font-semibold text-ink-primary'
                        : 'font-medium text-ink-secondary hover:bg-[#F4F6F8]',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-border-default pt-3 px-1 text-[11.5px] text-ink-muted">
        <div>Peran aktif: {formatRoleLabel(role)}</div>
        <div className="mt-0.5 text-ink-subtle">SIMPATI v1.0</div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-[248px] shrink-0 border-r border-border-default bg-surface lg:block">
        {sidebarBody}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-ink-primary/35"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-[260px] max-w-[82vw] border-r border-border-default bg-surface shadow-xl">
            <div className="flex items-center justify-end border-b border-border-default px-3 py-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-2 py-1 text-[12px] font-medium text-ink-muted hover:bg-surface-subtle cursor-pointer"
              >
                Tutup
              </button>
            </div>
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  )
}
