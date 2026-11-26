import { getToken } from '#/auth/auth-storage'
import { ApiException   } from './types'
import type {ErrorResponse, SuccessResponse} from './types';

const CONFIGURED_ENDPOINT = (
  import.meta.env.BACKEND_ENDPOINT || 'https://server0.simutu.my.id'
).replace(/\/+$/, '')

const isLocalOrigin =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')

const BASE_URL =
  import.meta.env.DEV || isLocalOrigin ? '/api' : CONFIGURED_ENDPOINT

export const AUTH_UNAUTHORIZED_EVENT = 'simpati:auth-unauthorized'

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
  headers?: Record<string, string>
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<SuccessResponse<T>> {
  const { method = 'GET', body, auth = true, headers = {} } = options
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  if (auth) {
    const token = getToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  let serializedBody: string | undefined
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
    serializedBody = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${normalizedPath}`, {
      method,
      headers: requestHeaders,
      body: serializedBody,
    })
  } catch {
    throw new ApiException({
      status: 0,
      title: 'Koneksi ke server gagal',
      description: 'Tidak dapat menghubungi server backend.',
      errors: [],
    })
  }

  let json: unknown = null
  try {
    json = await response.json()
  } catch {
    throw new ApiException({
      status: response.status || 500,
      title: 'Respons server tidak valid',
      description: 'Server mengembalikan format respons yang tidak dapat dibaca.',
      errors: [],
    })
  }

  const parsed = json as Partial<SuccessResponse<T> | ErrorResponse>

  if (!response.ok || parsed.success !== true) {
    const errPayload = parsed as Partial<ErrorResponse>
    const status = errPayload.status ?? (response.status || 500)

    if (status === 401 && auth && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
    }

    throw new ApiException({
      status,
      title: errPayload.message?.title ?? 'Permintaan gagal',
      description:
        errPayload.message?.description ??
        'Terjadi kesalahan saat memproses permintaan.',
      errors: errPayload.errors ?? [],
    })
  }

  return parsed as SuccessResponse<T>
}
