import { apiRequest } from './client'
import type { SuccessResponse } from './types'

export interface GoogleAuthorizationUrlData {
  authorizationUrl: string
}

export interface GoogleCallbackTokenData {
  token: string
}

export function requestGoogleAuthorization(): Promise<
  SuccessResponse<GoogleAuthorizationUrlData>
> {
  return apiRequest<GoogleAuthorizationUrlData>(
    '/accounts/auth/request/google',
    {
      method: 'POST',
      auth: false,
    },
  )
}

export function completeGoogleAuthorization(
  code: string,
  state: string,
): Promise<SuccessResponse<GoogleCallbackTokenData>> {
  const params = new URLSearchParams({ code, state })
  return apiRequest<GoogleCallbackTokenData>(
    `/accounts/auth/callback/google?${params.toString()}`,
    {
      method: 'GET',
      auth: false,
    },
  )
}
