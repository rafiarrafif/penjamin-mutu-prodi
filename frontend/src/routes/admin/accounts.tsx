import { useState  } from 'react'
import type {FormEvent} from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  createAccount,
  deleteFromAdmin,
  editFromAdmin
  
} from '#/api/account.api'
import type {EditFromAdminPayload} from '#/api/account.api';
import {
  ApiException,
  extractFieldErrors
  
  
  
} from '#/api/types'
import type {AccountRecord, SexType, UserRole} from '#/api/types';
import { formatRoleLabel } from '#/auth/role'
import { RequireRole } from '#/components/guards/require-role'
import { AppShell } from '#/components/layout/app-shell'
import {
  DangerBanner,
  InfoBanner,
  SuccessBanner,
} from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'
import { ConfirmDialog } from '#/components/ui/dialog'
import { FormField } from '#/components/ui/form-field'
import { SelectField } from '#/components/ui/select-field'
import { useToast } from '#/components/ui/toast'

export const Route = createFileRoute('/admin/accounts')({
  component: AdminAccountsRoute,
})

function AdminAccountsRoute() {
  return (
    <RequireRole requiredRole="admin" breadcrumb="Akun Pengguna">
      <AdminAccountsPage />
    </RequireRole>
  )
}

type AccountActionMode = 'create' | 'edit' | 'delete'

function AdminAccountsPage() {
  const { showToast } = useToast()
  const [mode, setMode] = useState<AccountActionMode>('create')

  // Create form state
  const [cFullname, setCFullname] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cRole, setCRole] = useState<Exclude<UserRole, 'verifier'>>('lecturer')
  const [cSex, setCSex] = useState<SexType>('male')
  const [cPhone, setCPhone] = useState('')
  const [cAddress, setCAddress] = useState('')

  // Edit form state
  const [eAccountId, setEAccountId] = useState('')
  const [eFullname, setEFullname] = useState('')
  const [eEmail, setEEmail] = useState('')
  const [eRole, setERole] = useState('')
  const [eSex, setESex] = useState('')
  const [ePhone, setEPhone] = useState('')
  const [eAddress, setEAddress] = useState('')

  // Delete form state
  const [dEmail, setDEmail] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState<{
    kind: 'success' | 'error'
    title: string
    description: string
  } | null>(null)
  const [recentResults, setRecentResults] = useState<
    { action: string; account: AccountRecord }[]
  >([])

  function switchMode(nextMode: AccountActionMode) {
    setMode(nextMode)
    setFieldErrors({})
    setBanner(null)
  }

  async function handleCreateSubmit(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setBanner(null)

    const errors: Record<string, string> = {}
    const fullname = cFullname.trim()
    const email = cEmail.trim()
    const phone = cPhone.trim()
    const address = cAddress.trim()

    if (!fullname || fullname.length > 255) {
      errors.fullname = 'Nama lengkap wajib diisi (1–255 karakter).'
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      errors.email = 'Masukkan alamat email yang valid (maks. 255 karakter).'
    }
    if (phone.length > 15) {
      errors.phone_no = 'Nomor telepon maksimal 15 karakter.'
    }
    if (address.length > 255) {
      errors.address = 'Alamat maksimal 255 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createAccount({
        fullname,
        email,
        role: cRole,
        sex: cSex,
        ...(phone ? { phone_no: phone } : {}),
        ...(address ? { address } : {}),
      })
      const created = res.data?.[0]
      if (created) {
        setRecentResults((prev) => [{ action: 'CREATE', account: created }, ...prev])
      }
      setBanner({
        kind: 'success',
        title: res.message.title,
        description: res.message.description,
      })
      showToast({
        variant: 'success',
        title: res.message.title,
        description: res.message.description,
      })
      setCFullname('')
      setCEmail('')
      setCRole('lecturer')
      setCSex('male')
      setCPhone('')
      setCAddress('')
    } catch (err) {
      handleApiError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditSubmit(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setBanner(null)

    const errors: Record<string, string> = {}
    const accountId = eAccountId.trim()
    const fullname = eFullname.trim()
    const email = eEmail.trim()
    const phone = ePhone.trim()
    const address = eAddress.trim()

    if (!accountId) {
      errors.account_id = 'Account ID wajib diisi.'
    }
    if (fullname && fullname.length > 255) {
      errors.fullname = 'Nama lengkap maksimal 255 karakter.'
    }
    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255)) {
      errors.email = 'Format email tidak valid (maks. 255 karakter).'
    }
    if (phone.length > 15) {
      errors.phone_no = 'Nomor telepon maksimal 15 karakter.'
    }
    if (address.length > 255) {
      errors.address = 'Alamat maksimal 255 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: EditFromAdminPayload = {
      account_id: accountId,
      ...(fullname ? { fullname } : {}),
      ...(email ? { email } : {}),
      ...(eRole ? { role: eRole as Exclude<UserRole, 'verifier'> } : {}),
      ...(eSex ? { sex: eSex } : {}),
      ...(phone ? { phone_no: phone } : {}),
      ...(address ? { address } : {}),
    }

    setIsSubmitting(true)
    try {
      const res = await editFromAdmin(payload)
      const updated = res.data?.[0]
      if (updated) {
        setRecentResults((prev) => [{ action: 'UPDATE', account: updated }, ...prev])
      }
      setBanner({
        kind: 'success',
        title: res.message.title,
        description: res.message.description,
      })
      showToast({
        variant: 'success',
        title: res.message.title,
        description: res.message.description,
      })
    } catch (err) {
      handleApiError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleRequestDelete(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setBanner(null)

    const email = dEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      setFieldErrors({
        email: 'Masukkan alamat email akun yang valid (maks. 255 karakter).',
      })
      return
    }
    setConfirmDeleteOpen(true)
  }

  async function handleConfirmDelete() {
    setIsSubmitting(true)
    try {
      const res = await deleteFromAdmin(dEmail.trim())
      const deleted = res.data?.[0]
      if (deleted) {
        setRecentResults((prev) => [{ action: 'DELETE', account: deleted }, ...prev])
      }
      setBanner({
        kind: 'success',
        title: res.message.title,
        description: res.message.description,
      })
      showToast({
        variant: 'success',
        title: res.message.title,
        description: res.message.description,
      })
      setDEmail('')
      setConfirmDeleteOpen(false)
    } catch (err) {
      setConfirmDeleteOpen(false)
      handleApiError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleApiError(err: unknown) {
    if (err instanceof ApiException) {
      setFieldErrors(extractFieldErrors(err))
      setBanner({
        kind: 'error',
        title: err.title,
        description: err.description,
      })
      showToast({
        variant: 'error',
        title: err.title,
        description: err.description,
      })
    } else {
      setBanner({
        kind: 'error',
        title: 'Operasi akun gagal',
        description: 'Terjadi kesalahan saat menghubungi backend.',
      })
    }
  }

  return (
    <AppShell breadcrumb="Manajemen / Akun Pengguna">
      <Link
        to="/dashboard"
        className="text-[12px] font-medium text-ink-muted no-underline hover:text-ink-primary"
      >
        &larr; Kembali ke Dashboard
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
            Manajemen Akun Pengguna
          </h1>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            Buat akun baru, ubah atribut pengguna, atau hapus akun (soft delete)
            dari sistem.
          </p>
        </div>

        <div className="inline-flex rounded-[6px] border border-border-default bg-surface p-0.5">
          {(
            [
              { id: 'create', label: 'Buat Akun' },
              { id: 'edit', label: 'Ubah Akun' },
              { id: 'delete', label: 'Hapus Akun' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchMode(tab.id)}
              className={`rounded-[5px] px-3 py-1.5 text-[12.5px] font-medium cursor-pointer transition-colors ${
                mode === tab.id
                  ? 'bg-nav-active font-semibold text-ink-primary'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <InfoBanner title="Daftar Akun Menunggu Endpoint Baca">
        Tabel daftar seluruh akun akan ditampilkan setelah endpoint{' '}
        <code className="font-mono text-[11.5px]">GET /accounts</code> tersedia
        di backend. Saat ini seluruh operasi mutasi akun sudah terhubung penuh
        ke backend.
      </InfoBanner>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_332px]">
        <Card padding="lg">
          {mode === 'create' && (
            <>
              <CardTitle>Buat Akun Baru</CardTitle>
              <CardDescription className="mt-0.5">
                Mengirim payload <code className="font-mono">CREATE</code> ke{' '}
                <code className="font-mono">POST /accounts/</code>.
              </CardDescription>

              <form
                onSubmit={(e) => {
                  void handleCreateSubmit(e)
                }}
                className="mt-4 flex flex-col gap-3.5"
              >
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <FormField
                    label="Nama Lengkap"
                    value={cFullname}
                    onChange={(e) => setCFullname(e.target.value)}
                    maxLength={255}
                    required
                    placeholder="Contoh: Dr. Budi Santoso"
                    error={fieldErrors.fullname}
                  />
                  <FormField
                    label="Email Google"
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    maxLength={255}
                    required
                    placeholder="budi@kampus.ac.id"
                    error={fieldErrors.email}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <SelectField
                    label="Peran (Role)"
                    value={cRole}
                    onChange={(e) =>
                      setCRole(e.target.value as Exclude<UserRole, 'verifier'>)
                    }
                    required
                    error={fieldErrors.role}
                    options={[
                      { value: 'lecturer', label: 'Dosen (lecturer)' },
                      {
                        value: 'verificator',
                        label: 'Verifikator (verificator)',
                      },
                      { value: 'admin', label: 'Admin (admin)' },
                      { value: 'director', label: 'Direktur (director)' },
                    ]}
                  />
                  <SelectField
                    label="Jenis Kelamin"
                    value={cSex}
                    onChange={(e) => setCSex(e.target.value as SexType)}
                    required
                    error={fieldErrors.sex}
                    options={[
                      { value: 'male', label: 'Laki-laki (male)' },
                      { value: 'female', label: 'Perempuan (female)' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <FormField
                    label="Nomor Telepon"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    maxLength={15}
                    placeholder="Opsional (maks. 15 karakter)"
                    error={fieldErrors.phone_no}
                  />
                  <FormField
                    label="Alamat"
                    value={cAddress}
                    onChange={(e) => setCAddress(e.target.value)}
                    maxLength={255}
                    placeholder="Opsional (maks. 255 karakter)"
                    error={fieldErrors.address}
                  />
                </div>

                {banner?.kind === 'error' && (
                  <DangerBanner title={banner.title}>
                    {banner.description}
                  </DangerBanner>
                )}
                {banner?.kind === 'success' && (
                  <SuccessBanner title={banner.title}>
                    {banner.description}
                  </SuccessBanner>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="submit"
                    variant="action"
                    isLoading={isSubmitting}
                    loadingText="Membuat Akun..."
                  >
                    Buat Akun
                  </Button>
                </div>
              </form>
            </>
          )}

          {mode === 'edit' && (
            <>
              <CardTitle>Ubah Akun (Admin)</CardTitle>
              <CardDescription className="mt-0.5">
                Mengirim payload <code className="font-mono">UPDATE</code> ke{' '}
                <code className="font-mono">POST /accounts/editfromadmin</code>.
                Kosongkan kolom yang tidak ingin diubah.
              </CardDescription>

              <form
                onSubmit={(e) => {
                  void handleEditSubmit(e)
                }}
                className="mt-4 flex flex-col gap-3.5"
              >
                <FormField
                  label="Account ID"
                  value={eAccountId}
                  onChange={(e) => setEAccountId(e.target.value)}
                  required
                  placeholder="UUID akun target"
                  className="font-mono text-[12.5px]"
                  error={fieldErrors.account_id}
                />

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <FormField
                    label="Nama Lengkap Baru"
                    value={eFullname}
                    onChange={(e) => setEFullname(e.target.value)}
                    maxLength={255}
                    placeholder="Opsional"
                    error={fieldErrors.fullname}
                  />
                  <FormField
                    label="Email Baru"
                    type="email"
                    value={eEmail}
                    onChange={(e) => setEEmail(e.target.value)}
                    maxLength={255}
                    placeholder="Opsional"
                    error={fieldErrors.email}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <SelectField
                    label="Peran Baru"
                    value={eRole}
                    onChange={(e) => setERole(e.target.value)}
                    error={fieldErrors.role}
                    options={[
                      { value: '', label: '— Tidak diubah —' },
                      { value: 'lecturer', label: 'Dosen (lecturer)' },
                      {
                        value: 'verificator',
                        label: 'Verifikator (verificator)',
                      },
                      { value: 'admin', label: 'Admin (admin)' },
                      { value: 'director', label: 'Direktur (director)' },
                    ]}
                  />
                  <SelectField
                    label="Jenis Kelamin Baru"
                    value={eSex}
                    onChange={(e) => setESex(e.target.value)}
                    error={fieldErrors.sex}
                    options={[
                      { value: '', label: '— Tidak diubah —' },
                      { value: 'male', label: 'Laki-laki (male)' },
                      { value: 'female', label: 'Perempuan (female)' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <FormField
                    label="Nomor Telepon Baru"
                    value={ePhone}
                    onChange={(e) => setEPhone(e.target.value)}
                    maxLength={15}
                    placeholder="Opsional"
                    error={fieldErrors.phone_no}
                  />
                  <FormField
                    label="Alamat Baru"
                    value={eAddress}
                    onChange={(e) => setEAddress(e.target.value)}
                    maxLength={255}
                    placeholder="Opsional"
                    error={fieldErrors.address}
                  />
                </div>

                {banner?.kind === 'error' && (
                  <DangerBanner title={banner.title}>
                    {banner.description}
                  </DangerBanner>
                )}
                {banner?.kind === 'success' && (
                  <SuccessBanner title={banner.title}>
                    {banner.description}
                  </SuccessBanner>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="submit"
                    variant="action"
                    isLoading={isSubmitting}
                    loadingText="Memperbarui..."
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </>
          )}

          {mode === 'delete' && (
            <>
              <CardTitle>Hapus Akun (Soft Delete)</CardTitle>
              <CardDescription className="mt-0.5">
                Mengirim payload <code className="font-mono">DELETE</code> ke{' '}
                <code className="font-mono">
                  POST /accounts/deletefromadmin
                </code>
                .
              </CardDescription>

              <form
                onSubmit={handleRequestDelete}
                className="mt-4 flex flex-col gap-3.5"
              >
                <FormField
                  label="Email Akun Target"
                  type="email"
                  value={dEmail}
                  onChange={(e) => setDEmail(e.target.value)}
                  maxLength={255}
                  required
                  placeholder="user@kampus.ac.id"
                  error={fieldErrors.email}
                  helperText="Akun akan dinonaktifkan melalui soft delete setelah konfirmasi."
                />

                {banner?.kind === 'error' && (
                  <DangerBanner title={banner.title}>
                    {banner.description}
                  </DangerBanner>
                )}
                {banner?.kind === 'success' && (
                  <SuccessBanner title={banner.title}>
                    {banner.description}
                  </SuccessBanner>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Button type="submit" variant="danger">
                    Hapus Akun
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardTitle>Aktivitas Akun (Sesi Ini)</CardTitle>
            <CardDescription className="mt-0.5">
              Hasil respons backend dari aksi yang dijalankan pada sesi ini.
            </CardDescription>

            {recentResults.length === 0 ? (
              <p className="mt-3 text-[12.5px] text-ink-muted">
                No accounts found in this session log yet.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {recentResults.map((item, idx) => (
                  <li
                    key={`${item.account.id}-${idx}`}
                    className="rounded-[6px] border border-border-default bg-surface-tinted px-3 py-2 text-[12px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink-primary">
                        {item.account.fullname}
                      </span>
                      <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-secondary">
                        {item.action}
                      </span>
                    </div>
                    <div className="truncate text-ink-muted">
                      {item.account.email}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-ink-muted">
                      <span>{formatRoleLabel(item.account.role)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEAccountId(item.account.id)
                          switchMode('edit')
                        }}
                        className="font-semibold text-brand-deep hover:underline cursor-pointer"
                      >
                        Salin ke Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <InfoBanner title="Provisi Akun Baru">
            Akun yang baru dibuat oleh Admin berstatus belum terverifikasi dan
            memerlukan persetujuan Direktur di menu Persetujuan Provisi.
          </InfoBanner>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Konfirmasi Penghapusan Akun"
        description={`Apakah Anda yakin ingin menonaktifkan akun dengan email "${dEmail}"? Tindakan ini melakukan soft-delete pada akun tersebut.`}
        confirmLabel="Ya, Hapus Akun"
        isLoading={isSubmitting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  )
}
