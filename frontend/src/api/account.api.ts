import { apiRequest } from './client'
import type { AccountRecord, SexType, SuccessResponse, UserRole } from './types'

export interface CreateAccountPayload {
  fullname: string
  email: string
  role: Exclude<UserRole, 'verifier'>
  sex: SexType
  phone_no?: string
  address?: string
}

export interface EditFromAdminPayload {
  account_id: string
  email?: string
  fullname?: string
  role?: Exclude<UserRole, 'verifier'>
  sex?: string
  phone_no?: string
  address?: string
}

export interface SelfEditPayload {
  email?: string
  fullname?: string
  role?: Exclude<UserRole, 'verifier'>
  sex?: string
  phone_no?: string
  address?: string
}

export function createAccount(
  payload: CreateAccountPayload,
): Promise<SuccessResponse<AccountRecord>> {
  return apiRequest<AccountRecord>('/accounts/', {
    method: 'POST',
    body: {
      operationType: 'CREATE',
      ...payload,
    },
  })
}

export function approveProvision(
  email: string,
): Promise<SuccessResponse<AccountRecord>> {
  return apiRequest<AccountRecord>('/accounts/approvalprovision', {
    method: 'POST',
    body: {
      operationType: 'UPDATE',
      email,
    },
  })
}

export function editFromAdmin(
  payload: EditFromAdminPayload,
): Promise<SuccessResponse<AccountRecord>> {
  return apiRequest<AccountRecord>('/accounts/editfromadmin', {
    method: 'POST',
    body: {
      operationType: 'UPDATE',
      ...payload,
    },
  })
}

export function deleteFromAdmin(
  email: string,
): Promise<SuccessResponse<AccountRecord>> {
  return apiRequest<AccountRecord>('/accounts/deletefromadmin', {
    method: 'POST',
    body: {
      operationType: 'DELETE',
      email,
    },
  })
}

export function editSelf(
  payload: SelfEditPayload,
): Promise<SuccessResponse<AccountRecord>> {
  return apiRequest<AccountRecord>('/accounts/selfedit', {
    method: 'POST',
    body: {
      operationType: 'UPDATE',
      ...payload,
    },
  })
}
