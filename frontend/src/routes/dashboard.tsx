import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { getAllCategories } from '#/api/document.api'
import { ApiException  } from '#/api/types'
import type {DataCategoryRecord} from '#/api/types';
import { useAuth } from '#/auth/auth-context'
import {
  canApproveProvision,
  canManageAccounts,
  canManageCategories,
  canManageDepartments,
  formatRoleLabel,
} from '#/auth/role'
import { RequireAuth } from '#/components/guards/require-auth'
import { AppShell } from '#/components/layout/app-shell'
import { DangerBanner, InfoBanner } from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  )
}

function DashboardPage() {
  const { account, role, sessionId } = useAuth()
  const [categories, setCategories] = useState<DataCategoryRecord[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<{
    title: string
    description: string
  } | null>(null)

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true)
    setCategoryError(null)
    try {
      const res = await getAllCategories()
      setCategories(res.data ?? [])
    } catch (err) {
      if (err instanceof ApiException) {
        setCategoryError({
          title: err.title,
          description: err.description,
        })
      } else {
        setCategoryError({
          title: 'Gagal memuat kategori',
          description: 'Tidak dapat mengambil daftar kategori data dari server.',
        })
      }
    } finally {
      setIsLoadingCategories(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const navCards = [
    {
      title: 'Profil Saya',
      description:
        'Perbarui nama lengkap, email, nomor telepon, dan alamat akun Anda.',
      to: '/profile' as const,
      visible: true,
      badge: 'Semua Peran',
    },
    {
      title: 'Kategori Data',
      description:
        'Kelola daftar kategori dokumen mutu beserta kebutuhan bukti terkait.',
      to: '/admin/categories' as const,
      visible: canManageCategories(role),
      badge: 'Admin+',
    },
    {
      title: 'Departemen',
      description:
        'Tambahkan departemen atau unit kerja baru di lingkungan prodi.',
      to: '/admin/departments' as const,
      visible: canManageDepartments(role),
      badge: 'Admin+',
    },
    {
      title: 'Akun Pengguna',
      description:
        'Buat akun baru, ubah atribut pengguna, atau nonaktifkan akun.',
      to: '/admin/accounts' as const,
      visible: canManageAccounts(role),
      badge: 'Admin+',
    },
    {
      title: 'Persetujuan Provisi',
      description:
        'Verifikasi dan aktifkan akun baru yang diajukan oleh administrator.',
      to: '/director/provisions' as const,
      visible: canApproveProvision(role),
      badge: 'Direktur',
    },
  ].filter((item) => item.visible)

  return (
    <AppShell breadcrumb="Dashboard">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
            Dashboard
          </h1>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            Ringkasan akun aktif, status verifikasi, dan akses modul sesuai
            peran Anda.
          </p>
        </div>

        <Link to="/profile">
          <Button variant="action">Kelola Profil</Button>
        </Link>
      </div>

      <InfoBanner title="Keterbukaan Data Aktual">
        Dashboard ini hanya menampilkan informasi akun dari sesi autentikasi
        dan data kategori aktual dari backend. Modul ringkasan akun dan
        departemen akan tampil penuh setelah endpoint pembacaan tersedia di
        backend.
      </InfoBanner>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Akses Cepat Sesuai Peran</CardTitle>
                <CardDescription className="mt-0.5">
                  Menu yang tampil otomatis menyesuaikan hak akses{' '}
                  <strong className="text-ink-primary">
                    {formatRoleLabel(role)}
                  </strong>
                  .
                </CardDescription>
              </div>
              <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-[11.5px] font-semibold text-ink-secondary">
                {navCards.length} modul tersedia
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {navCards.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex flex-col justify-between rounded-[8px] border border-border-default bg-surface p-4 no-underline transition-colors hover:border-brand-action hover:bg-surface-tinted"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold text-ink-primary group-hover:text-brand-deep">
                        {item.title}
                      </span>
                      <span className="rounded bg-surface-subtle px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-muted">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-3 text-[12px] font-semibold text-brand-deep">
                    Buka halaman &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-default px-5 py-3.5">
              <div>
                <CardTitle>Daftar Kategori Data (Aktual Backend)</CardTitle>
                <CardDescription className="mt-0.5">
                  Diambil langsung dari{' '}
                  <code className="font-mono text-[11.5px]">
                    POST /documents/categories/getalllist
                  </code>
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                isLoading={isLoadingCategories}
                onClick={() => {
                  void loadCategories()
                }}
              >
                Muat Ulang
              </Button>
            </div>

            {isLoadingCategories ? (
              <div className="px-5 py-6 text-[13px] text-ink-muted">
                Memuat kategori data dari server...
              </div>
            ) : categoryError ? (
              <div className="p-4">
                <DangerBanner title={categoryError.title}>
                  <p>{categoryError.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2.5"
                    onClick={() => {
                      void loadCategories()
                    }}
                  >
                    Coba Lagi
                  </Button>
                </DangerBanner>
              </div>
            ) : categories.length === 0 ? (
              <div className="px-5 py-6 text-[13px] text-ink-muted">
                Belum ada kategori data yang tercatat di sistem.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-default bg-table-head text-[11.5px] font-semibold text-[#475467]">
                      <th className="px-4 py-2.5">Nama Kategori</th>
                      <th className="px-4 py-2.5">Slug</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.slice(0, 6).map((cat) => (
                      <tr
                        key={cat.id}
                        className="border-b border-[#F0F2F5] text-[13px] last:border-b-0 hover:bg-[#F9FCFE]"
                      >
                        <td className="px-4 py-2.5 font-medium text-ink-primary">
                          {cat.name}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[12px] text-ink-muted">
                          {cat.slug}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardTitle>Informasi Akun Masuk</CardTitle>
            <CardDescription className="mt-0.5">
              Identitas aktif berdasarkan sesi token saat ini.
            </CardDescription>

            <dl className="mt-3.5 flex flex-col gap-2.5 text-[12.5px]">
              <div className="flex justify-between gap-2 border-b border-[#F0F2F5] pb-2">
                <dt className="text-ink-muted">Nama Lengkap</dt>
                <dd className="text-right font-semibold text-ink-primary">
                  {account?.fullname ?? '-'}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-b border-[#F0F2F5] pb-2">
                <dt className="text-ink-muted">Email</dt>
                <dd className="truncate text-right font-medium text-ink-secondary">
                  {account?.email ?? '-'}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-b border-[#F0F2F5] pb-2">
                <dt className="text-ink-muted">Peran</dt>
                <dd className="font-semibold text-ink-primary">
                  {formatRoleLabel(role)}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-b border-[#F0F2F5] pb-2">
                <dt className="text-ink-muted">Status Verifikasi</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      account?.isVerified
                        ? 'bg-success-soft text-success-text'
                        : 'bg-warning-soft text-warning-text'
                    }`}
                  >
                    {account?.isVerified
                      ? 'Terverifikasi'
                      : 'Menunggu Persetujuan'}
                  </span>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-ink-muted">Session ID</dt>
                <dd className="truncate rounded bg-surface-subtle px-2 py-1 font-mono text-[11px] text-ink-secondary">
                  {sessionId ?? '-'}
                </dd>
              </div>
            </dl>
          </Card>

          <Card variant="tinted">
            <CardTitle>Jumlah Kategori Aktif</CardTitle>
            <div className="mt-1.5 text-[28px] font-bold tracking-[-0.02em] text-ink-primary tabular-nums">
              {isLoadingCategories ? '...' : categories.length}
            </div>
            <p className="mt-1 text-[12px] text-ink-muted">
              Kategori data terdata di backend.
            </p>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}
