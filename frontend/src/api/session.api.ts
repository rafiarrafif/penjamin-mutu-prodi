import { apiRequest } from './client'
import type { SuccessResponse } from './types'

export function revokeCurrentSession(): Promise<SuccessResponse> {
  return apiRequest('/sessions/revokecurrent', {
    method: 'POST',
    body: {
      operationType: 'UPDATE',
    },
  })
}
