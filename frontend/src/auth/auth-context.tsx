import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
  
} from 'react'
import type {ReactNode} from 'react';
import { useNavigate } from '@tanstack/react-router'
import { AUTH_UNAUTHORIZED_EVENT } from '#/api/client'
import { revokeCurrentSession } from '#/api/session.api'
import type { AccountRecord } from '#/api/types'
import {
  clearToken,
  getToken,
  parseJwtAuthSession,
  setToken,
} from './auth-storage'
import type { AuthContextValue } from './auth-types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setTokenState] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [account, setAccount] = useState<AccountRecord | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const clearLocalAuth = useCallback(() => {
    clearToken()
    setTokenState(null)
    setSessionId(null)
    setAccount(null)
  }, [])

  const loginWithToken = useCallback(
    (rawToken: string): boolean => {
      const parsed = parseJwtAuthSession(rawToken)
      if (!parsed) {
        clearLocalAuth()
        return false
      }
      setToken(rawToken)
      setTokenState(rawToken)
      setSessionId(parsed.sessionId)
      setAccount(parsed.account)
      return true
    },
    [clearLocalAuth],
  )

  const updateLocalAccount = useCallback((next: AccountRecord) => {
    setAccount((prev) => (prev ? { ...prev, ...next } : next))
  }, [])

  useEffect(() => {
    const stored = getToken()
    if (stored) {
      const parsed = parseJwtAuthSession(stored)
      if (parsed) {
        setTokenState(stored)
        setSessionId(parsed.sessionId)
        setAccount(parsed.account)
      } else {
        clearToken()
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      clearLocalAuth()
      void navigate({ to: '/login' })
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [clearLocalAuth, navigate])

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await revokeCurrentSession()
      }
    } catch {
      // Clear local token regardless so revoked/expired sessions cannot stay authenticated locally.
    } finally {
      clearLocalAuth()
      await navigate({ to: '/login' })
    }
  }, [clearLocalAuth, navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      sessionId,
      account,
      role: account?.role ?? null,
      isAuthenticated: Boolean(token && account),
      isLoading,
      loginWithToken,
      updateLocalAccount,
      clearLocalAuth,
      logout,
    }),
    [
      token,
      sessionId,
      account,
      isLoading,
      loginWithToken,
      updateLocalAccount,
      clearLocalAuth,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
