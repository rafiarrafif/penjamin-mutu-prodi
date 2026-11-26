import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { completeGoogleAuthorization } from '#/api/auth.api'
import { ApiException } from '#/api/types'
import { useAuth } from '#/auth/auth-context'
import { BrandLockup } from '#/components/layout/brand-lockup'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'

export function OAuthCallbackView() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const hasAttemptedRef = useRef(false)

  useEffect(() => {
    if (hasAttemptedRef.current) return
    hasAttemptedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const directToken = params.get('token')
    const providerError = params.get('error')
    const code = params.get('code')
    const oauthState = params.get('state')

    function redirectToContactAdmin(options: {
      reason: string
      title: string
      description: string
      status?: number
    }) {
      void navigate({
        to: '/contact-admin',
        replace: true,
        search: {
          reason: options.reason,
          title: options.title,
          description: options.description,
          ...(options.status ? { status: String(options.status) } : {}),
        },
      })
    }

    if (directToken) {
      const stored = loginWithToken(directToken)
      if (stored) {
        void navigate({ to: '/dashboard', replace: true })
      } else {
        redirectToContactAdmin({
          reason: 'invalid_token',
          title: 'Token autentikasi tidak valid',
          description:
            'Token sesi yang diterima tidak valid atau telah kedaluwarsa. Hubungi Admin Prodi jika kendala berlanjut.',
        })
      }
      return
    }

    if (providerError) {
      redirectToContactAdmin({
        reason: 'denied',
        title: 'Otorisasi Google ditolak',
        description: `Permintaan masuk dibatalkan atau ditolak oleh penyedia Google (${providerError}).`,
      })
      return
    }

    if (!code || !oauthState) {
      redirectToContactAdmin({
        reason: 'invalid_callback',
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
          redirectToContactAdmin({
            reason: 'missing_token',
            title: 'Token autentikasi tidak ditemukan',
            description:
              'Server berhasil memproses callback tetapi tidak mengembalikan token JWT.',
          })
          return
        }

        const stored = loginWithToken(token)
        if (!stored) {
          redirectToContactAdmin({
            reason: 'invalid_token',
            title: 'Token JWT tidak valid',
            description:
              'Payload token yang diterima tidak memuat identitas akun yang lengkap.',
          })
          return
        }

        await navigate({ to: '/dashboard', replace: true })
      } catch (err) {
        if (err instanceof ApiException) {
          redirectToContactAdmin({
            reason: 'auth_failed',
            status: err.status,
            title: err.title,
            description: err.description,
          })
        } else {
          redirectToContactAdmin({
            reason: 'auth_failed',
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
          <div className="flex flex-col items-center py-4 text-center">
            <span
              aria-hidden="true"
              className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-action border-t-transparent"
            />
            <CardTitle className="mt-4 text-[17px]">
              Memverifikasi akun Google...
            </CardTitle>
            <CardDescription className="mt-1.5">
              Mohon tunggu sebentar sementara sistem mengarahkan Anda ke
              dashboard.
            </CardDescription>
          </div>
        </Card>
      </main>
    </div>
  )
}
