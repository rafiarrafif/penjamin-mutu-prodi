import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { completeGoogleAuthorization } from '#/api/auth.api'
import { ApiException } from '#/api/types'
import { useAuth } from '#/auth/auth-context'
import { BrandLockup } from '#/components/layout/brand-lockup'
import { DangerBanner } from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'

type CallbackState =
  | { kind: 'loading' }
  | { kind: 'denied'; title: string; description: string }
  | { kind: 'invalid'; title: string; description: string }
  | { kind: 'error'; title: string; description: string; status?: number }

export function OAuthCallbackView() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [state, setState] = useState<CallbackState>({ kind: 'loading' })
  const hasAttemptedRef = useRef(false)

  useEffect(() => {
    if (hasAttemptedRef.current) return
    hasAttemptedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const providerError = params.get('error')
    const code = params.get('code')
    const oauthState = params.get('state')

    if (providerError) {
      setState({
        kind: 'denied',
        title: 'Otorisasi Google ditolak',
        description: `Permintaan masuk dibatalkan atau ditolak oleh penyedia Google (${providerError}).`,
      })
      return
    }

    if (!code || !oauthState) {
      setState({
        kind: 'invalid',
        title: 'Parameter callback tidak valid',
        description:
          'URL callback tidak menyertakan parameter code dan state yang diperlukan untuk menyelesaikan autentikasi.',
      })
      return
    }

    void (async () => {
      try {
        const res = await completeGoogleAuthorization(code, oauthState)
        const token = res.data?.[0]?.token
        if (!token) {
          setState({
            kind: 'error',
            title: 'Token autentikasi tidak ditemukan',
            description:
              'Backend berhasil memproses callback tetapi tidak mengembalikan token JWT.',
          })
          return
        }

        const stored = loginWithToken(token)
        if (!stored) {
          setState({
            kind: 'error',
            title: 'Token JWT tidak valid',
            description:
              'Payload token yang diterima tidak memuat identitas akun yang lengkap.',
          })
          return
        }

        await navigate({ to: '/dashboard', replace: true })
      } catch (err) {
        if (err instanceof ApiException) {
          setState({
            kind: 'error',
            status: err.status,
            title: err.title,
            description: err.description,
          })
        } else {
          setState({
            kind: 'error',
            title: 'Gagal menyelesaikan autentikasi',
            description:
              'Terjadi kesalahan saat memverifikasi callback Google ke backend.',
          })
        }
      }
    })()
  }, [loginWithToken, navigate])

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[56px] items-center justify-between border-b border-border-default bg-surface px-6 lg:px-10">
        <BrandLockup to="/" />
        <span className="text-[12px] text-ink-muted">OAuth Callback</span>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-[440px]" padding="lg">
          {state.kind === 'loading' ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span
                aria-hidden="true"
                className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-action border-t-transparent"
              />
              <CardTitle className="mt-4 text-[17px]">
                Memverifikasi akun Google...
              </CardTitle>
              <CardDescription className="mt-1.5">
                Mohon tunggu sebentar sementara sistem menukar kode otorisasi
                dengan sesi aktif.
              </CardDescription>
            </div>
          ) : (
            <div>
              <span className="inline-flex items-center rounded-full bg-danger-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-danger-text">
                {state.kind === 'denied'
                  ? 'Akses Ditolak'
                  : state.kind === 'invalid'
                    ? 'Callback Tidak Valid'
                    : `Error ${state.status ?? ''}`.trim()}
              </span>
              <CardTitle className="mt-3 text-[18px]">{state.title}</CardTitle>
              <DangerBanner className="mt-3">{state.description}</DangerBanner>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link to="/login">
                  <Button variant="action">Kembali ke Halaman Masuk</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">Ke Beranda</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
