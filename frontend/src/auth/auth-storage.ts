import type { AccountRecord } from '#/api/types'

export const TOKEN_STORAGE_KEY = 'auth_token'

export interface DecodedAuthPayload {
  sessionId: string
  account: AccountRecord
  exp?: number
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )
  const binary = window.atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function parseJwtAuthSession(token: string): DecodedAuthPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null

    const raw = JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>

    if (typeof raw.exp === 'number' && raw.exp * 1000 <= Date.now()) {
      return null
    }

    if (typeof raw.session_id !== 'string' || !raw.session_id) {
      return null
    }

    if (typeof raw.account !== 'object' || raw.account === null) {
      return null
    }

    const acct = raw.account as Record<string, unknown>
    if (
      typeof acct.id !== 'string' ||
      !acct.id ||
      typeof acct.fullname !== 'string' ||
      !acct.fullname ||
      typeof acct.email !== 'string' ||
      !acct.email ||
      typeof acct.role !== 'string' ||
      !acct.role
    ) {
      return null
    }

    const account: AccountRecord = {
      id: acct.id,
      sub: typeof acct.sub === 'string' ? acct.sub : undefined,
      fullname: acct.fullname,
      email: acct.email,
      profilePicture:
        typeof acct.profilePicture === 'string' ? acct.profilePicture : null,
      role: acct.role,
      sex: typeof acct.sex === 'string' ? acct.sex : 'male',
      phoneNo: typeof acct.phoneNo === 'string' ? acct.phoneNo : null,
      address: typeof acct.address === 'string' ? acct.address : null,
      isVerified: Boolean(acct.isVerified),
      createdAt:
        typeof acct.createdAt === 'string' ? acct.createdAt : undefined,
      updatedAt:
        typeof acct.updatedAt === 'string' ? acct.updatedAt : undefined,
      deletedAt: typeof acct.deletedAt === 'string' ? acct.deletedAt : null,
    }

    return {
      sessionId: raw.session_id,
      account,
      exp: typeof raw.exp === 'number' ? raw.exp : undefined,
    }
  } catch {
    return null
  }
}
