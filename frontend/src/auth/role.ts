export const ROLE_HIERARCHY: Record<string, number> = {
  lecturer: 0,
  verifier: 1,
  verificator: 1,
  admin: 2,
  director: 3,
}

export function getRoleLevel(role?: string | null): number {
  if (!role) return -1
  return ROLE_HIERARCHY[role.toLowerCase()] ?? -1
}

export function hasMinimumRole(
  actualRole: string | null | undefined,
  requiredRole: string,
): boolean {
  const requiredLevel =
    ROLE_HIERARCHY[requiredRole.toLowerCase()] ?? Number.MAX_SAFE_INTEGER
  return getRoleLevel(actualRole) >= requiredLevel
}

export function canManageAccounts(role?: string | null): boolean {
  return hasMinimumRole(role, 'admin')
}

export function canApproveProvision(role?: string | null): boolean {
  return hasMinimumRole(role, 'director')
}

export function canManageDepartments(role?: string | null): boolean {
  return hasMinimumRole(role, 'admin')
}

export function canManageCategories(role?: string | null): boolean {
  return hasMinimumRole(role, 'admin')
}

export function formatRoleLabel(role?: string | null): string {
  switch (role?.toLowerCase()) {
    case 'director':
      return 'Direktur'
    case 'admin':
      return 'Admin'
    case 'verificator':
    case 'verifier':
      return 'Verifikator'
    case 'lecturer':
      return 'Dosen'
    default:
      return role || 'Pengguna'
  }
}
