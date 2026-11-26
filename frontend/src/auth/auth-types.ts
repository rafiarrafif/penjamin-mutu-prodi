import type { AccountRecord } from '#/api/types'

export interface AuthContextValue {
  token: string | null
  sessionId: string | null
  account: AccountRecord | null
  role: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loginWithToken: (token: string) => boolean
  updateLocalAccount: (next: AccountRecord) => void
  clearLocalAuth: () => void
  logout: () => Promise<void>
}
