import { useState  } from 'react'
import type {FormEvent} from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import { approveProvision } from '#/api/account.api'
import {
  ApiException,
  extractFieldErrors
  
} from '#/api/types'
import type {AccountRecord} from '#/api/types';
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
import { FormField } from '#/components/ui/form-field'
import { useToast } from '#/components/ui/toast'

export const Route = createFileRoute('/director/provisions')({
  component: DirectorProvisionsRoute,
})

function DirectorProvisionsRoute() {
  return (
    <RequireRole requiredRole="director" breadcrumb="Persetujuan Provisi">
      <DirectorProvisionsPage />
    </RequireRole>
  )
}

interface ApprovalOutcome {
  kind: 'approved' | 'already_verified'
  status: number
  title: string
  description: string
  account?: AccountRecord
}

function DirectorProvisionsPage() {
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [errorState, setErrorState] = useState<{
    title: string
    description: string
  } | null>(null)
  const [outcome, setOutcome] = useState<ApprovalOutcome | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setErrorState(null)
    setOutcome(null)

    const trimmedEmail = email.trim()
    if (
      !trimmedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) ||
      trimmedEmail.length > 255
    ) {
      setFieldErrors({
        email: 'Masukkan alamat email akun yang valid (maks. 255 karakter).',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await approveProvision(trimmedEmail)
      const isAlreadyVerified = response.status === 201

      setOutcome({
        kind: isAlreadyVerified ? 'already_verified' : 'approved',
        status: response.status,
        title: response.message.title,
        description: response.message.description,
        account: response.data?.[0],
      })

      showToast({
        variant: isAlreadyVerified ? 'info' : 'success',
        title: response.message.title,
        description: response.message.description,
      })
      setEmail('')
    } catch (err) {
      if (err instanceof ApiException) {
        setFieldErrors(extractFieldErrors(err))
        setErrorState({
          title: err.title,
          description: err.description,
        })
        showToast({
          variant: 'error',
          title: err.title,
          description: err.description,
        })
      } else {
        setErrorState({
          title: 'Gagal memproses persetujuan',
          description: 'Terjadi kesalahan saat menyetujui provisi akun.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell breadcrumb="Direktur / Persetujuan Provisi">
      <Link
        to="/dashboard"
        className="text-[12px] font-medium text-ink-muted no-underline hover:text-ink-primary"
      >
        &larr; Kembali ke Dashboard
      </Link>

      <div>
        <h1 className="m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
          Persetujuan Provisi Akun
        </h1>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          Verifikasi dan aktifkan akun baru yang telah didaftarkan oleh Admin
          Program Studi.
        </p>
      </div>

      <InfoBanner title="Daftar Akun Belum Terverifikasi">
        Antrean tabel akun tertunda akan tampil otomatis setelah endpoint{' '}
        <code className="font-mono text-[11.5px]">
          GET /accounts/unverified
        </code>{' '}
        tersedia di backend. Masukkan email akun yang akan disetujui di bawah
        ini.
      </InfoBanner>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_332px]">
        <div className="flex flex-col gap-4">
          <Card padding="lg">
            <CardTitle>Setujui Provisi Akun</CardTitle>
            <CardDescription className="mt-0.5">
              Mengirim{' '}
              <code className="font-mono text-[11.5px]">
                POST /accounts/approvalprovision
              </code>{' '}
              khusus peran Direktur.
            </CardDescription>

            <form
              onSubmit={(e) => {
                void handleSubmit(e)
              }}
              className="mt-4 flex flex-col gap-3.5"
            >
              <FormField
                label="Operation Type"
                value="UPDATE"
                locked
                className="font-mono"
              />

              <FormField
                label="Email Akun"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
                placeholder="dosen@kampus.ac.id"
                error={fieldErrors.email}
                helperText="Masukkan email akun yang akan diverifikasi oleh Direktur."
              />

              {errorState && (
                <DangerBanner title={errorState.title}>
                  {errorState.description}
                </DangerBanner>
              )}

              <div className="flex items-center gap-2.5 pt-1">
                <Button
                  type="submit"
                  variant="action"
                  isLoading={isSubmitting}
                  loadingText="Memverifikasi..."
                >
                  Setujui Akun
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  onClick={() => {
                    setEmail('')
                    setFieldErrors({})
                    setErrorState(null)
                    setOutcome(null)
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>

          {outcome && (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Hasil Verifikasi Provisi</CardTitle>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
                    outcome.kind === 'approved'
                      ? 'bg-success-soft text-success-text'
                      : 'bg-surface-tinted text-brand-deep border border-border-tinted'
                  }`}
                >
                  {outcome.kind === 'approved'
                    ? '200 · Account approved'
                    : '201 · Account already verified'}
                </span>
              </div>

              {outcome.kind === 'approved' ? (
                <SuccessBanner title={outcome.title} className="mt-3">
                  {outcome.description}
                </SuccessBanner>
              ) : (
                <InfoBanner title={outcome.title} className="mt-3">
                  {outcome.description}
                </InfoBanner>
              )}

              {outcome.account && (
                <div className="mt-3 grid grid-cols-1 gap-2 rounded-[6px] border border-border-default bg-canvas p-3 text-[12.5px] sm:grid-cols-2">
                  <div>
                    <span className="text-ink-muted">Nama: </span>
                    <strong className="text-ink-primary">
                      {outcome.account.fullname}
                    </strong>
                  </div>
                  <div>
                    <span className="text-ink-muted">Email: </span>
                    <strong className="text-ink-primary">
                      {outcome.account.email}
                    </strong>
                  </div>
                  <div>
                    <span className="text-ink-muted">Peran: </span>
                    <strong className="text-ink-primary">
                      {formatRoleLabel(outcome.account.role)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-ink-muted">Status: </span>
                    <strong className="text-success-text">
                      {outcome.account.isVerified
                        ? 'Terverifikasi'
                        : 'Belum Terverifikasi'}
                    </strong>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardTitle>Status Respons Backend</CardTitle>
            <CardDescription className="mt-0.5">
              Backend membedakan dua status sukses pada endpoint ini:
            </CardDescription>
            <div className="mt-3 flex flex-col gap-2.5 text-[12.5px]">
              <div className="rounded-[6px] border border-[#ABEFC6] bg-success-soft p-2.5 text-success-text">
                <strong>HTTP 200 — Account approved</strong>
                <p className="mt-0.5 text-[12px] opacity-90">
                  Akun baru berhasil diverifikasi dan diaktifkan.
                </p>
              </div>
              <div className="rounded-[6px] border border-border-tinted bg-surface-tinted p-2.5 text-brand-deep">
                <strong>HTTP 201 — Account already verified</strong>
                <p className="mt-0.5 text-[12px] text-ink-secondary">
                  Akun sebelumnya sudah berstatus terverifikasi, tidak ada
                  perubahan data.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}
