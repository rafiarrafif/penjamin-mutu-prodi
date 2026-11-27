import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { BrandLockup } from '#/components/layout/brand-lockup'
import {
  DangerBanner,
  InfoBanner,
  SuccessBanner,
} from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'
import { FormField, TextareaField } from '#/components/ui/form-field'
import { SelectField } from '#/components/ui/select-field'
import { useToast } from '#/components/ui/toast'

export interface ContactAdminSearch {
  reason?: string
  title?: string
  description?: string
  status?: string
}

export const Route = createFileRoute('/contact-admin')({
  validateSearch: (search: Record<string, unknown>): ContactAdminSearch => ({
    reason: typeof search.reason === 'string' ? search.reason : undefined,
    title: typeof search.title === 'string' ? search.title : undefined,
    description:
      typeof search.description === 'string' ? search.description : undefined,
    status: typeof search.status === 'string' ? search.status : undefined,
  }),
  component: ContactAdminPage,
})

const ADMIN_EMAIL = 'admin.mutu@prodi.ac.id'

function ContactAdminPage() {
  const search = Route.useSearch()
  const { showToast } = useToast()

  const errorTitle =
    search.title || 'Login Gagal — Akun Memerlukan Bantuan Admin'
  const errorDescription =
    search.description ||
    'Akun Google Anda belum terdaftar di sistem penjaminan mutu, belum terverifikasi, atau otorisasi masuk dibatalkan.'

  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [requestedRole, setRequestedRole] = useState('lecturer')
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)

  function buildMessageBody(): string {
    return [
      'Halo Admin Penjaminan Mutu Prodi (SIMUTU),',
      '',
      'Saya mengalami kendala saat masuk ke portal SIMUTU dan membutuhkan bantuan pendaftaran/verifikasi akun.',
      '',
      `Nama Lengkap: ${senderName.trim() || '-'}`,
      `Email Google: ${senderEmail.trim() || '-'}`,
      `Peran yang Diajukan: ${requestedRole}`,
      `Status/Kode Error: ${search.status ? `HTTP ${search.status}` : search.reason || 'Login gagal'}`,
      `Detail Error: ${errorTitle} — ${errorDescription}`,
      `Catatan Tambahan: ${notes.trim() || '-'}`,
    ].join('\n')
  }

  async function handleCopyMessage() {
    const text = buildMessageBody()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast({
        variant: 'success',
        title: 'Pesan disalin',
        description:
          'Format pesan permohonan akses berhasil disalin. Silakan kirimkan ke Admin Prodi.',
      })
    } catch {
      showToast({
        variant: 'error',
        title: 'Gagal menyalin otomatis',
        description: 'Silakan salin detail secara manual dari kolom pesan.',
      })
    }
  }

  function handleMailtoSubmit(event: FormEvent) {
    event.preventDefault()
    const subject = encodeURIComponent(
      '[SIMUTU] Permintaan Pendaftaran / Bantuan Login Akun',
    )
    const body = encodeURIComponent(buildMessageBody())
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-primary">
      <header className="border-b border-border-default bg-surface">
        <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between px-6 lg:px-10">
          <BrandLockup to="/" />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[12.5px] font-medium text-brand-deep no-underline hover:underline"
            >
              Coba Masuk Lagi
            </Link>
            <Link
              to="/"
              className="text-[12.5px] font-medium text-ink-muted no-underline hover:text-ink-primary"
            >
              Beranda
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-4 px-6 py-8 lg:px-10">
        <Link
          to="/login"
          className="text-[12px] font-medium text-ink-muted no-underline hover:text-ink-primary"
        >
          &larr; Kembali ke Halaman Masuk
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-danger-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-danger-text">
              {search.status
                ? `Gagal Masuk · HTTP ${search.status}`
                : search.reason === 'denied'
                  ? 'Akses Google Dibatalkan'
                  : 'Akses Masuk Ditolak'}
            </span>
            <h1 className="mt-2 m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
              Hubungi Administrator Program Studi
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              Halaman khusus bantuan akses bagi pengguna yang gagal melakukan
              autentikasi ke portal SIMUTU.
            </p>
          </div>

          <Link to="/login">
            <Button variant="outline">Coba Masuk Ulang</Button>
          </Link>
        </div>

        <DangerBanner title={errorTitle}>{errorDescription}</DangerBanner>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_340px]">
          <Card padding="lg">
            <CardTitle>Formulir Permohonan Bantuan / Provisi Akun</CardTitle>
            <CardDescription className="mt-0.5">
              Lengkapi data di bawah ini untuk membuat pesan permohonan akses
              yang siap dikirimkan kepada Admin Program Studi.
            </CardDescription>

            <form
              onSubmit={handleMailtoSubmit}
              className="mt-4 flex flex-col gap-3.5"
            >
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <FormField
                  label="Nama Lengkap"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  maxLength={255}
                  placeholder="Contoh: Dr. Razan Pratama"
                />
                <FormField
                  label="Email Google yang Digunakan"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  maxLength={255}
                  placeholder="nama@kampus.ac.id"
                />
              </div>

              <SelectField
                label="Peran yang Diajukan"
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                options={[
                  { value: 'lecturer', label: 'Dosen (lecturer)' },
                  { value: 'verificator', label: 'Verifikator (verificator)' },
                  { value: 'admin', label: 'Admin (admin)' },
                ]}
              />

              <TextareaField
                label="Keterangan Tambahan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                placeholder="Jelaskan unit/program studi Anda atau kendala yang muncul saat login..."
              />

              {copied && (
                <SuccessBanner title="Format pesan telah disalin">
                  Tempelkan (paste) pesan ke WhatsApp, email, atau kanal resmi
                  Administrator Program Studi.
                </SuccessBanner>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Button type="submit" variant="action">
                  Kirim Email ke Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void handleCopyMessage()
                  }}
                >
                  Salin Format Pesan
                </Button>
              </div>
            </form>
          </Card>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardTitle>Kontak Pengelola Sistem</CardTitle>
              <CardDescription className="mt-0.5">
                Hubungi administrator berikut untuk pendaftaran atau pengecekan
                status akun Anda:
              </CardDescription>

              <dl className="mt-3 flex flex-col gap-2.5 text-[12.5px]">
                <div className="border-b border-[#F0F2F5] pb-2">
                  <dt className="text-ink-muted">Email Admin Prodi</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-brand-deep">
                    {ADMIN_EMAIL}
                  </dd>
                </div>
                <div className="border-b border-[#F0F2F5] pb-2">
                  <dt className="text-ink-muted">Unit Pengelola</dt>
                  <dd className="mt-0.5 font-medium text-ink-primary">
                    Tim Penjaminan Mutu Program Studi
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Jam Layanan</dt>
                  <dd className="mt-0.5 text-ink-secondary">
                    Senin – Jumat, 08.00 – 16.00 WIB
                  </dd>
                </div>
              </dl>
            </Card>

            <InfoBanner title="Penyebab Umum Gagal Masuk">
              <ul className="m-0 list-disc space-y-1 pl-4">
                <li>
                  Email Google belum didaftarkan oleh Admin di menu Manajemen
                  Akun.
                </li>
                <li>
                  Akun baru belum mendapatkan persetujuan provisi dari Direktur.
                </li>
                <li>
                  Otorisasi Google dibatalkan atau tautan callback sudah
                  kedaluwarsa.
                </li>
              </ul>
            </InfoBanner>
          </aside>
        </div>
      </main>

      <footer className="border-t border-border-default bg-surface py-3.5 text-[12px] text-ink-muted">
        <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-2 px-6 lg:px-10">
          <span>SIMUTU &middot; Pusat Bantuan Akses</span>
          <span>&copy; 2026 Penjaminan Mutu Prodi</span>
        </div>
      </footer>
    </div>
  )
}
