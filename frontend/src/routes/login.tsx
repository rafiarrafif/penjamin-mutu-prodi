import { useEffect, useState } from 'react'
import { Link, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'
import { requestGoogleAuthorization } from '#/api/auth.api'
import { ApiException } from '#/api/types'
import { useAuth } from '#/auth/auth-context'
import { BrandLockup } from '#/components/layout/brand-lockup'
import { InfoBanner } from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const providerError = params.get('error')
    if (providerError) {
      void navigate({
        to: '/contact-admin',
        replace: true,
        search: {
          reason: 'denied',
          title: 'Login Google gagal atau dibatalkan',
          description: `Penyedia autentikasi mengembalikan status error (${providerError}).`,
        },
      })
    }
  }, [navigate])

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true)
    try {
      const response = await requestGoogleAuthorization()
      const authorizationUrl = response.data?.[0]?.authorizationUrl
      if (!authorizationUrl) {
        await navigate({
          to: '/contact-admin',
          search: {
            reason: 'missing_auth_url',
            title: 'URL otorisasi tidak tersedia',
            description:
              'Server tidak mengembalikan tautan otorisasi Google OAuth.',
          },
        })
        return
      }
      window.location.assign(authorizationUrl)
    } catch (err) {
      if (err instanceof ApiException) {
        await navigate({
          to: '/contact-admin',
          search: {
            reason: 'auth_request_failed',
            status: String(err.status),
            title: err.title,
            description: err.description,
          },
        })
      } else {
        await navigate({
          to: '/contact-admin',
          search: {
            reason: 'auth_request_failed',
            title: 'Gagal memulai login Google',
            description:
              'Terjadi kesalahan tak terduga saat menghubungi layanan autentikasi.',
          },
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-primary">
      <header className="border-b border-border-default bg-surface">
        <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between px-6 lg:px-10">
          <BrandLockup to="/" />
          <Link
            to="/"
            className="text-[12.5px] font-medium text-ink-muted no-underline hover:text-ink-primary"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-[860px] grid-cols-1 items-center gap-12 md:grid-cols-[1fr_380px]">
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-deep">
              Portal Autentikasi
            </p>
            <h1 className="m-0 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary">
              Sistem Penjaminan Mutu
              <br />
              Program Studi
            </h1>
            <p className="mt-3 max-w-[380px] text-[13.5px] leading-[1.6] text-ink-muted">
              Masuk menggunakan akun Google yang telah didaftarkan oleh Admin
              prodi untuk mengelola kategori data, departemen, profil, serta
              persetujuan provisi akun.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 rounded-[10px] border border-border-default bg-surface p-6 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="m-0 text-[16px] font-bold text-ink-primary">
                Masuk ke Akun
              </h2>
              <p className="mt-1 text-[12px] text-ink-muted">
                Autentikasi resmi menggunakan Google OAuth 2.0
              </p>
            </div>

            <InfoBanner title="Syarat Akses Akun">
              Pastikan email Google Anda sudah diprovisi oleh Admin dan telah
              terverifikasi sebelum melanjutkan proses masuk.
            </InfoBanner>

            <div className="pt-1">
              <Button
                variant="action"
                size="md"
                className="w-full"
                isLoading={isSubmitting || isLoading}
                loadingText="Mengarahkan ke Google..."
                onClick={() => {
                  void handleGoogleSignIn()
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M21.35 11.1H12v3.2h5.35c-.25 1.45-1.55 4.25-5.35 4.25-3.22 0-5.85-2.66-5.85-5.95S8.78 6.65 12 6.65c1.84 0 3.07.78 3.77 1.45l2.57-2.48C16.7 4.08 14.55 3.15 12 3.15 7.03 3.15 3 7.18 3 12.15s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.07-1.05-.15-1.25Z" />
                </svg>
                Masuk dengan Google
              </Button>
            </div>

            <div className="flex items-center gap-2.5 text-[11px] font-semibold text-ink-subtle">
              <span className="h-px flex-1 bg-border-default" />
              <span>SESI TERENKRIPSI JWT</span>
              <span className="h-px flex-1 bg-border-default" />
            </div>

            <p className="m-0 text-center text-[11.5px] leading-relaxed text-ink-muted">
              Belum memiliki akses atau gagal masuk?{' '}
              <Link
                to="/contact-admin"
                className="font-semibold text-brand-deep no-underline hover:underline"
              >
                Hubungi Admin Prodi
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-default bg-surface py-3.5 text-[12px] text-ink-muted">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-2 px-6 lg:px-10">
          <span>SIMUTU &middot; Autentikasi Google OAuth</span>
          <span>&copy; 2026 Penjaminan Mutu Prodi</span>
        </div>
      </footer>
    </div>
  )
}
