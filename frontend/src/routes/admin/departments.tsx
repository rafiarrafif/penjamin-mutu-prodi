import { useState  } from 'react'
import type {FormEvent} from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import { createDepartment } from '#/api/department.api'
import {
  ApiException,
  extractFieldErrors
  
} from '#/api/types'
import type {DepartmentRecord} from '#/api/types';
import { RequireRole } from '#/components/guards/require-role'
import { AppShell } from '#/components/layout/app-shell'
import {
  DangerBanner,
  InfoBanner,
  SuccessBanner,
} from '#/components/ui/alert-banner'
import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardTitle } from '#/components/ui/card'
import { FormField, TextareaField } from '#/components/ui/form-field'
import { useToast } from '#/components/ui/toast'

export const Route = createFileRoute('/admin/departments')({
  component: AdminDepartmentsRoute,
})

function AdminDepartmentsRoute() {
  return (
    <RequireRole requiredRole="admin" breadcrumb="Departemen">
      <AdminDepartmentsPage />
    </RequireRole>
  )
}

function AdminDepartmentsPage() {
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formBanner, setFormBanner] = useState<{
    kind: 'success' | 'error'
    title: string
    description: string
  } | null>(null)
  const [createdItems, setCreatedItems] = useState<DepartmentRecord[]>([])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFieldErrors({})
    setFormBanner(null)

    const trimmedName = name.trim()
    const trimmedDesc = description.trim()
    const errors: Record<string, string> = {}

    if (!trimmedName || trimmedName.length > 115) {
      errors.name = 'Nama departemen wajib diisi (maksimal 115 karakter).'
    }
    if (trimmedDesc.length > 255) {
      errors.description = 'Deskripsi departemen maksimal 255 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await createDepartment({
        name: trimmedName,
        ...(trimmedDesc ? { description: trimmedDesc } : {}),
      })

      const created = response.data?.[0]
      if (created) {
        setCreatedItems((prev) => [created, ...prev])
      }

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

      setName('')
      setDescription('')
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
          title: 'Gagal membuat departemen',
          description: 'Terjadi kesalahan saat menyimpan departemen baru.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell breadcrumb="Manajemen / Departemen">
      <Link
        to="/dashboard"
        className="text-[12px] font-medium text-ink-muted no-underline hover:text-ink-primary"
      >
        &larr; Kembali ke Dashboard
      </Link>

      <div>
        <h1 className="m-0 text-[22px] font-bold tracking-[-0.015em] text-ink-primary">
          Manajemen Departemen
        </h1>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          Tambahkan departemen atau unit pelaksana mutu di lingkungan program
          studi.
        </p>
      </div>

      <InfoBanner title="Ketersediaan Daftar Departemen">
        Backend saat ini menyediakan endpoint pembuatan departemen (
        <code className="font-mono text-[11.5px]">POST /departments/</code>).
        Tabel penuh seluruh departemen akan aktif setelah endpoint{' '}
        <code className="font-mono text-[11.5px]">GET /departments</code>{' '}
        ditambahkan di backend.
      </InfoBanner>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_332px]">
        <Card padding="lg">
          <CardTitle>Tambah Departemen Baru</CardTitle>
          <CardDescription className="mt-0.5">
            Isi nama dan deskripsi singkat departemen yang akan didaftarkan.
          </CardDescription>

          <form
            onSubmit={(e) => {
              void handleSubmit(e)
            }}
            className="mt-4 flex flex-col gap-3.5"
          >
            <FormField
              label="Operation Type"
              value="CREATE"
              locked
              className="font-mono"
            />

            <FormField
              label="Nama Departemen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={115}
              required
              placeholder="Contoh: Program Studi Teknik Informatika"
              error={fieldErrors.name}
              helperText="Wajib diisi, maksimal 115 karakter."
            />

            <TextareaField
              label="Deskripsi Departemen"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={255}
              placeholder="Deskripsi singkat tanggung jawab atau cakupan unit..."
              error={fieldErrors.description}
              helperText="Opsional, maksimal 255 karakter."
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

            <div className="flex items-center gap-2.5 pt-1">
              <Button
                type="submit"
                variant="action"
                isLoading={isSubmitting}
                loadingText="Menyimpan..."
              >
                Simpan Departemen
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => {
                  setName('')
                  setDescription('')
                  setFieldErrors({})
                  setFormBanner(null)
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardTitle>Departemen Dibuat (Sesi Ini)</CardTitle>
            <CardDescription className="mt-0.5">
              Konfirmasi respons server dari penambahan departemen pada sesi
              halaman ini.
            </CardDescription>

            {createdItems.length === 0 ? (
              <p className="mt-3 text-[12.5px] text-ink-muted">
                No departments found in this session yet.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {createdItems.map((dept) => (
                  <li
                    key={dept.id}
                    className="rounded-[6px] border border-border-default bg-surface-tinted px-3 py-2 text-[12.5px]"
                  >
                    <div className="font-semibold text-ink-primary">
                      {dept.name}
                    </div>
                    {dept.description && (
                      <div className="mt-0.5 text-[12px] text-ink-muted">
                        {dept.description}
                      </div>
                    )}
                    <div className="mt-1 font-mono text-[11px] text-ink-subtle">
                      ID: {dept.id}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <InfoBanner title="Akses Peran">
            Hanya Admin dan Direktur yang dapat membuat data departemen baru.
          </InfoBanner>
        </aside>
      </div>
    </AppShell>
  )
}
