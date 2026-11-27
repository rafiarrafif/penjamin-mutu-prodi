import { useCallback, useEffect, useMemo, useState  } from 'react'
import type {FormEvent} from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
  getSpecificCategory,
} from '#/api/document.api'
import {
  ApiException,
  extractFieldErrors
  
  
} from '#/api/types'
import type {DataCategoryDetail, DataCategoryRecord} from '#/api/types';
import { RequireRole } from '#/components/guards/require-role'
import { AppShell } from '#/components/layout/app-shell'
import {
  DangerBanner,
  InfoBanner,
  SuccessBanner,
} from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'
import { ConfirmDialog } from '#/components/ui/dialog'
import { FormField } from '#/components/ui/form-field'
import { useToast } from '#/components/ui/toast'

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesRoute,
})

function AdminCategoriesRoute() {
  return (
    <RequireRole requiredRole="admin" breadcrumb="Kategori Data">
      <AdminCategoriesPage />
    </RequireRole>
  )
}

const PAGE_SIZE = 6

function AdminCategoriesPage() {
  const { showToast } = useToast()

  const [categories, setCategories] = useState<DataCategoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<{
    title: string
    description: string
  } | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedDetail, setSelectedDetail] =
    useState<DataCategoryDetail | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const [editingCategory, setEditingCategory] =
    useState<DataCategoryRecord | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formBanner, setFormBanner] = useState<{
    kind: 'success' | 'error'
    title: string
    description: string
  } | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<DataCategoryRecord | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await getAllCategories()
      setCategories(res.data ?? [])
    } catch (err) {
      if (err instanceof ApiException) {
        setLoadError({ title: err.title, description: err.description })
      } else {
        setLoadError({
          title: 'Gagal memuat kategori',
          description: 'Tidak dapat mengambil daftar kategori data dari server.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCategories()
  }, [fetchCategories])

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    )
  }, [categories, searchQuery])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE),
  )
  const safePage = Math.min(currentPage, totalPages)
  const paginatedCategories = filteredCategories.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  async function handleInspectDetail(id: string) {
    setIsLoadingDetail(true)
    try {
      const res = await getSpecificCategory(id)
      setSelectedDetail(res.data?.[0] ?? null)
    } catch (err) {
      if (err instanceof ApiException) {
        showToast({
          variant: 'error',
          title: err.title,
          description: err.description,
        })
      }
    } finally {
      setIsLoadingDetail(false)
    }
  }

  function startEdit(cat: DataCategoryRecord) {
    setEditingCategory(cat)
    setCategoryName(cat.name)
    setFieldErrors({})
    setFormBanner(null)
  }

  function resetForm() {
    setEditingCategory(null)
    setCategoryName('')
    setFieldErrors({})
  }

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setFormBanner(null)

    const trimmed = categoryName.trim()
    const maxLen = editingCategory ? 255 : 250
    if (!trimmed || trimmed.length > maxLen) {
      setFieldErrors({
        name: `Nama kategori wajib diisi (maksimal ${maxLen} karakter).`,
      })
      return
    }

    setIsSaving(true)
    try {
      const response = editingCategory
        ? await editCategory(editingCategory.id, trimmed)
        : await createCategory(trimmed)

      setFormBanner({
        kind: 'success',
        title: response.message.title,
        description: response.message.description,
      })
      showToast({
        variant: 'success',
        title: response.message.title,
        description: response.message.description,
      })

      resetForm()
      await fetchCategories()
    } catch (err) {
      if (err instanceof ApiException) {
        setFieldErrors(extractFieldErrors(err))
        setFormBanner({
          kind: 'error',
          title: err.title,
          description: err.description,
        })
        showToast({
          variant: 'error',
          title: err.title,
          description: err.description,
        })
      } else {
        setFormBanner({
          kind: 'error',
          title: 'Gagal menyimpan kategori',
          description: 'Terjadi kesalahan saat mengirim data kategori.',
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await deleteCategory(deleteTarget.id)
      showToast({
        variant: 'success',
        title: res.message.title,
        description: res.message.description,
      })
      if (selectedDetail?.id === deleteTarget.id) {
        setSelectedDetail(null)
      }
      if (editingCategory?.id === deleteTarget.id) {
        resetForm()
      }
      setDeleteTarget(null)
      await fetchCategories()
    } catch (err) {
      if (err instanceof ApiException) {
        showToast({
          variant: 'error',
          title: err.title,
          description: err.description,
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AppShell breadcrumb="Manajemen / Kategori Data">
      <Link
        to="/dashboard"
        className="text-[12px] font-medium text-ink-muted no-underline hover:text-ink-primary"
      >
        &larr; Kembali ke Dashboard
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
            Manajemen Kategori Data
          </h1>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            Kelola kategori dokumen mutu beserta daftar kebutuhan bukti terkait.
          </p>
        </div>

        <Button
          variant="action"
          onClick={() => {
            resetForm()
            setFormBanner(null)
          }}
        >
          + Kategori Baru
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-ink-muted">
        <span>Daftar Kategori Aktif</span>
        <span className="tabular-nums">
          Total: {categories.length} kategori terdaftar
        </span>
      </div>

      <InfoBanner title="Ketentuan Kategori Data">
        Nama kategori maksimal 250 karakter saat pembuatan. Slug URL dibuat
        otomatis oleh backend dan setiap aksi tercatat ke audit log sistem.
      </InfoBanner>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_332px]">
        <div className="flex min-w-0 flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari nama atau slug kategori..."
              aria-label="Cari kategori"
              className="h-[35px] min-w-[200px] flex-1 rounded-[6px] border border-border-strong bg-surface px-3 text-[13px] text-ink-primary placeholder:text-ink-subtle outline-none focus:border-brand-action focus:ring-3 focus:ring-brand-action/15"
            />
            <Button
              variant="outline"
              isLoading={isLoading}
              onClick={() => {
                void fetchCategories()
              }}
            >
              Segarkan
            </Button>
          </div>

          <Card padding="none" className="overflow-hidden">
            {isLoading ? (
              <div className="px-5 py-8 text-[13px] text-ink-muted">
                Memuat daftar kategori...
              </div>
            ) : loadError ? (
              <div className="p-4">
                <DangerBanner title={loadError.title}>
                  <p>{loadError.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2.5"
                    onClick={() => {
                      void fetchCategories()
                    }}
                  >
                    Coba Lagi
                  </Button>
                </DangerBanner>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-ink-muted">
                No categories found.{' '}
                {searchQuery
                  ? 'Ubah kata kunci pencarian Anda.'
                  : 'Tambahkan kategori baru melalui panel di samping.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-default bg-table-head text-[11.5px] font-semibold text-[#475467]">
                      <th className="px-4 py-2.5">Nama Kategori</th>
                      <th className="px-4 py-2.5">Slug</th>
                      <th className="w-[210px] px-4 py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCategories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="border-b border-[#F0F2F5] text-[13px] last:border-b-0 hover:bg-[#F9FCFE]"
                      >
                        <td className="px-4 py-2.5 font-semibold text-ink-primary">
                          {cat.name}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[12px] text-ink-muted">
                          {cat.slug}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                void handleInspectDetail(cat.id)
                              }}
                            >
                              Detail
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(cat)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-danger-text hover:bg-danger-soft"
                              onClick={() => setDeleteTarget(cat)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {filteredCategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-ink-muted">
              <span className="tabular-nums">
                Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filteredCategories.length)} dari{' '}
                {filteredCategories.length} kategori
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`grid h-[28px] w-[28px] place-items-center rounded-[6px] border text-[12px] font-semibold cursor-pointer ${
                        page === safePage
                          ? 'border-ink-primary bg-ink-primary text-white'
                          : 'border-border-default bg-surface text-ink-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {(isLoadingDetail || selectedDetail) && (
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>
                    {isLoadingDetail
                      ? 'Memuat detail kategori...'
                      : `Detail Kategori: ${selectedDetail?.name}`}
                  </CardTitle>
                  {selectedDetail && (
                    <CardDescription className="mt-0.5">
                      Slug:{' '}
                      <code className="font-mono text-[11.5px]">
                        {selectedDetail.slug}
                      </code>{' '}
                      &middot; ID:{' '}
                      <code className="font-mono text-[11.5px]">
                        {selectedDetail.id}
                      </code>
                    </CardDescription>
                  )}
                </div>
                {selectedDetail && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDetail(null)}
                  >
                    Tutup
                  </Button>
                )}
              </div>

              {selectedDetail && (
                <div className="mt-3">
                  {selectedDetail.requirements.length === 0 ? (
                    <p className="text-[12.5px] text-ink-muted">
                      Belum ada kebutuhan data (
                      <code className="font-mono">data_requirements</code>) pada
                      kategori ini.
                    </p>
                  ) : (
                    <ul className="m-0 list-disc space-y-1 pl-4 text-[12.5px] text-ink-secondary">
                      {selectedDetail.requirements.map((req) => (
                        <li key={req.id}>
                          <strong>{req.name}</strong>{' '}
                          <span className="font-mono text-[11px] text-ink-muted">
                            ({req.frequencyCode})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-[68px]">
          <Card>
            <CardTitle>
              {editingCategory ? 'Ubah Kategori Data' : 'Tambah Kategori Data'}
            </CardTitle>
            <CardDescription className="mt-0.5">
              {editingCategory
                ? `Mengubah kategori "${editingCategory.name}"`
                : 'Buat kategori dokumen mutu baru.'}
            </CardDescription>

            <form
              onSubmit={(e) => {
                void handleFormSubmit(e)
              }}
              className="mt-3.5 flex flex-col gap-3"
            >
              {editingCategory && (
                <FormField
                  label="Category ID"
                  value={editingCategory.id}
                  locked
                  className="font-mono text-[12px]"
                />
              )}

              <FormField
                label="Nama Kategori"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                maxLength={editingCategory ? 255 : 250}
                required
                placeholder="Contoh: Kurikulum & RPS"
                error={fieldErrors.name}
                helperText={
                  editingCategory
                    ? 'Wajib diisi, maksimal 255 karakter.'
                    : 'Wajib diisi, maksimal 250 karakter.'
                }
              />

              {formBanner?.kind === 'error' && (
                <DangerBanner title={formBanner.title}>
                  {formBanner.description}
                </DangerBanner>
              )}

              {formBanner?.kind === 'success' && (
                <SuccessBanner title={formBanner.title}>
                  {formBanner.description}
                </SuccessBanner>
              )}

              <InfoBanner>
                Endpoint:{' '}
                <code className="font-mono text-[11.5px]">
                  {editingCategory
                    ? 'POST /documents/categories/edit'
                    : 'POST /documents/categories/'}
                </code>
              </InfoBanner>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="submit"
                  variant="action"
                  isLoading={isSaving}
                  loadingText="Menyimpan..."
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSaving}
                  onClick={() => {
                    resetForm()
                    setFormBanner(null)
                  }}
                >
                  {editingCategory ? 'Batal Edit' : 'Reset'}
                </Button>
              </div>
            </form>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Kategori Data?"
        description={`Kategori "${deleteTarget?.name ?? ''}" akan di-soft-delete dari daftar aktif dan tercatat di audit log.`}
        confirmLabel="Hapus Kategori"
        isLoading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  )
}
