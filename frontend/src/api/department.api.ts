import { apiRequest } from './client'
import type { DepartmentRecord, SuccessResponse } from './types'

export interface CreateDepartmentPayload {
  name: string
  description?: string
}

export function createDepartment(
  payload: CreateDepartmentPayload,
): Promise<SuccessResponse<DepartmentRecord>> {
  return apiRequest<DepartmentRecord>('/departments/', {
    method: 'POST',
    body: {
      operationType: 'CREATE',
      ...payload,
    },
  })
}
