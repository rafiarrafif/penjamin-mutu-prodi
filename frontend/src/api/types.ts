export type UserRole =
  | 'lecturer'
  | 'verificator'
  | 'verifier'
  | 'admin'
  | 'director'

export type SexType = 'male' | 'female'

export interface ApiMessage {
  title: string
  description: string
}

export interface ApiFieldError {
  field?: string
  message?: string
  code?: string
}

export interface SuccessResponse<T = unknown> {
  success: true
  status: number
  message: ApiMessage
  data?: T[]
}

export interface ErrorResponse {
  success: false
  status: number
  message: ApiMessage
  errors: unknown[]
}

export interface AccountRecord {
  id: string
  sub?: string
  fullname: string
  email: string
  profilePicture: string | null
  role: UserRole | string
  sex: string
  phoneNo: string | null
  address: string | null
  isVerified: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface DepartmentRecord {
  id: string
  name: string
  description: string | null
  accountIdCreator?: string
  accountIdUpdater?: string | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface DataCategoryRecord {
  id: string
  slug: string
  name: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface DataRequirementRecord {
  id: string
  dataCategoryId: string
  frequencyCode: string
  name: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface DataCategoryDetail extends DataCategoryRecord {
  requirements: DataRequirementRecord[]
}

export class ApiException extends Error {
  readonly status: number
  readonly title: string
  readonly description: string
  readonly errors: ApiFieldError[]

  constructor(options: {
    status: number
    title: string
    description: string
    errors?: unknown[]
  }) {
    super(options.description || options.title)
    this.name = 'ApiException'
    this.status = options.status
    this.title = options.title
    this.description = options.description
    this.errors = Array.isArray(options.errors)
      ? options.errors.filter(
          (item): item is ApiFieldError =>
            typeof item === 'object' && item !== null,
        )
      : []
  }
}

export function extractFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiException)) return {}

  const fieldMap: Record<string, string> = {}
  for (const item of error.errors) {
    if (typeof item.field === 'string' && item.field.trim() && item.message) {
      if (!fieldMap[item.field]) {
        fieldMap[item.field] = item.message
      }
    }
  }
  return fieldMap
}
