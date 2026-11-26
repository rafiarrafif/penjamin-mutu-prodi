import { useState  } from 'react'
import type {FormEvent} from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import { editSelf  } from '#/api/account.api'
import type {SelfEditPayload} from '#/api/account.api';
import {
  ApiException,
  extractFieldErrors
  
} from '#/api/types'
import type {UserRole} from '#/api/types';
import { useAuth } from '#/auth/auth-context'
import { formatRoleLabel } from '#/auth/role'
import { RequireAuth } from '#/components/guards/require-auth'
import { AppShell } from '#/components/layout/app-shell'
import {
  DangerBanner,
  InfoBanner,
  SuccessBanner,
} from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'
import { FormField } from '#/components/ui/form-field'
import { SelectField } from '#/components/ui/select-field'
import { useToast } from '#/components/ui/toast'

export const Route = createFileRoute('/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  )
}

function ProfilePage() {
  const { account, role, updateLocalAccount } = useAuth()
  const { showToast } = useToast()

  const isDirector = role?.toLowerCase() === 'director'

  const [fullname, setFullname] = useState(account?.fullname ?? '')
  const [email, setEmail] = useState(account?.email ?? '')
  const [sex, setSex] = useState(account?.sex ?? 'male')
  const [phoneNo, setPhoneNo] = useState(account?.phoneNo ?? '')
  const [address, setAddress] = useState(account?.address ?? '')
  const [selectedRole, setSelectedRole] = useState(account?.role ?? 'lecturer')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<{
    title: string
    description: string
  } | null>(null)
  const [successMsg, setSuccessMsg] = useState<{
    title: string
    description: string
  } | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)
    setSuccessMsg(null)

    const nextErrors: Record<string, string> = {}
    const trimmedName = fullname.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phoneNo.trim()
    const trimmedAddress = address.trim()

    if (!trimmedName || trimmedName.length > 255) {
      nextErrors.fullname = 'Nama lengkap wajib diisi (1–255 karakter).'
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
      nextErrors.email = 'Masukkan alamat email yang valid (maks. 255 karakter).'
    }
    if (sex.length > 6) {
      nextErrors.sex = 'Jenis kelamin maksimal 6 karakter.'
    }
    if (trimmedPhone.length > 15) {
      nextErrors.phone_no = 'Nomor telepon maksimal 15 karakter.'
    }
    if (trimmedAddress.length > 255) {
      nextErrors.address = 'Alamat maksimal 255 karakter.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    const payload: SelfEditPayload = {}
    if (trimmedName !== (account?.fullname ?? '')) payload.fullname = trimmedName
    if (trimmedEmail !== (account?.email ?? '')) payload.email = trimmedEmail
    if (sex !== (account?.sex ?? '')) payload.sex = sex
    if (trimmedPhone !== (account?.phoneNo ?? '')) payload.phone_no = trimmedPhone
    if (trimmedAddress !== (account?.address ?? '')) payload.address = trimmedAddress
    if (isDirector && selectedRole !== (account?.role ?? '')) {
      payload.role = selectedRole as Exclude<UserRole, 'verifier'>
    }

    if (Object.keys(payload).length === 0) {
      setFormError({
        title: 'Tidak ada perubahan',
        description: 'Ubah minimal satu kolom profil sebelum menyimpan.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await editSelf(payload)
      const updated = response.data?.[0]
      if (updated) {
        updateLocalAccount(updated)
      }
      setSuccessMsg({
        title: response.message.title,
        description: response.message.description,
      })
      showToast({
        variant: 'success',
        title: response.message.title,
        description: response.message.description,
      })
    } catch (err) {
      if (err instanceof ApiException) {
        setFieldErrors(extractFieldErrors(err))
        setFormError({
          title: err.title,
          description: err.description,
        })
        showToast({
          variant: 'error',
          title: err.title,
          description: err.description,
        })
      } else {
        setFormError({
          title: 'Gagal memperbarui profil',
          description: 'Terjadi kesalahan saat menyimpan perubahan profil.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell breadcrumb="Profil Saya">
      <Link
        to="/dashboard"
        className="text-[12px] font-medium text-ink-muted no-underline hover:text-ink-primary"
      >
        &larr; Kembali ke Dashboard
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
            Profil Akun
          </h1>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            Perbarui informasi pribadi Anda sesuai batas validasi sistem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_332px]">
        <Card padding="lg">
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription className="mt-0.5">
            Data dikirim ke{' '}
            <code className="font-mono text-[11.5px]">
              POST /accounts/selfedit
            </code>
            .
          </CardDescription>

          <form
            onSubmit={(e) => {
              void handleSubmit(e)
            }}
            className="mt-4 flex flex-col gap-3.5"
          >
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <FormField
                label="ID Akun"
                value={account?.id ?? ''}
                locked
                helperText="Identitas sistem tidak dapat diubah."
              />
              <FormField
                label="Status Verifikasi"
                value={
                  account?.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'
                }
                locked
              />
            </div>

            <FormField
              label="Nama Lengkap"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              maxLength={255}
              required
              error={fieldErrors.fullname}
              helperText="Minimal 1 karakter, maksimal 255 karakter."
            />

            <FormField
              label="Email Institusi"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
              error={fieldErrors.email}
              helperText="Maksimal 255 karakter."
            />

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <SelectField
                label="Jenis Kelamin"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                error={fieldErrors.sex}
                options={[
                  { value: 'male', label: 'Laki-laki (male)' },
                  { value: 'female', label: 'Perempuan (female)' },
                ]}
              />

              <FormField
                label="Nomor Telepon"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                maxLength={15}
                placeholder="08123456789"
                error={fieldErrors.phone_no}
                helperText="Opsional, maksimal 15 karakter."
              />
            </div>

            <FormField
              label="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={255}
              placeholder="Alamat domisili atau unit kerja"
              error={fieldErrors.address}
              helperText="Opsional, maksimal 255 karakter."
            />

            {isDirector ? (
              <SelectField
                label="Peran Akun"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                error={fieldErrors.role}
                helperText="Khusus Direktur dapat mengubah kolom peran."
                options={[
                  { value: 'director', label: 'Direktur (director)' },
                  { value: 'admin', label: 'Admin (admin)' },
                  { value: 'verificator', label: 'Verifikator (verificator)' },
                  { value: 'lecturer', label: 'Dosen (lecturer)' },
                ]}
              />
            ) : (
              <FormField
                label="Peran Akun"
                value={`${formatRoleLabel(account?.role)} (${account?.role ?? '-'})`}
                locked
                helperText="Hanya Direktur yang diizinkan mengubah peran akun."
              />
            )}

            {formError && (
              <DangerBanner title={formError.title}>
                {formError.description}
              </DangerBanner>
            )}

            {successMsg && (
              <SuccessBanner title={successMsg.title}>
                {successMsg.description}
              </SuccessBanner>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <Button
                type="submit"
                variant="action"
                isLoading={isSubmitting}
                loadingText="Menyimpan..."
              >
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => {
                  setFullname(account?.fullname ?? '')
                  setEmail(account?.email ?? '')
                  setSex(account?.sex ?? 'male')
                  setPhoneNo(account?.phoneNo ?? '')
                  setAddress(account?.address ?? '')
                  setSelectedRole(account?.role ?? 'lecturer')
                  setFieldErrors({})
                  setFormError(null)
                  setSuccessMsg(null)
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardTitle>Panduan Pembaruan Profil</CardTitle>
            <CardDescription className="mt-1">
              Hanya kolom yang berubah yang akan dikirim ke backend saat
              menyimpan.
            </CardDescription>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[12.5px] text-ink-muted">
              <li>Email harus unik dan aktif untuk login Google OAuth.</li>
              <li>Nomor telepon maksimal 15 karakter.</li>
              <li>
                Perubahan data langsung memperbarui tampilan profil di aplikasi.
              </li>
            </ul>
          </Card>

          <InfoBanner title="Catatan Keamanan">
            Sesi token JWT tetap berlaku sampai Anda keluar atau masa berlaku
            token habis.
          </InfoBanner>
        </aside>
      </div>
    </AppShell>
  )
}
