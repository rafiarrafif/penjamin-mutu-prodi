import { apiRequest } from './client'
import type {
  DataCategoryDetail,
  DataCategoryRecord,
  SuccessResponse,
} from './types'

export function getAllCategories(): Promise<
  SuccessResponse<DataCategoryRecord>
> {
  return apiRequest<DataCategoryRecord>('/documents/categories/getalllist', {
    method: 'POST',
    body: {
      operationType: 'READ',
    },
  })
}

export function getSpecificCategory(
  id: string,
): Promise<SuccessResponse<DataCategoryDetail>> {
  return apiRequest<DataCategoryDetail>('/documents/categories/getspecific', {
    method: 'POST',
    body: {
      operationType: 'READ',
      id,
    },
  })
}

export function createCategory(
  name: string,
): Promise<SuccessResponse<DataCategoryRecord>> {
  return apiRequest<DataCategoryRecord>('/documents/categories/', {
    method: 'POST',
    body: {
      operationType: 'CREATE',
      name,
    },
  })
}

export function editCategory(
  categoryId: string,
  name: string,
): Promise<SuccessResponse<DataCategoryRecord>> {
  return apiRequest<DataCategoryRecord>('/documents/categories/edit', {
    method: 'POST',
    body: {
      operationType: 'UPDATE',
      category_id: categoryId,
      name,
    },
  })
}

export function deleteCategory(
  categoryId: string,
): Promise<SuccessResponse<DataCategoryRecord>> {
  return apiRequest<DataCategoryRecord>('/documents/categories/delete', {
    method: 'POST',
    body: {
      operationType: 'DELETE',
      category_id: categoryId,
    },
  })
}
