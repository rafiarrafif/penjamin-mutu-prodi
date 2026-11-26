import type { prisma } from "../../../utils/prisma";

export interface EditDepartmentRepositoryPort {
  findById(departmentId: string): Promise<{ id: string; name: string } | null>;
  update(
    departmentId: string,
    data: { name?: string; description?: string | null },
    accountIdUpdater: string,
  ): Promise<unknown>;
}

export class EditDepartmentRepository implements EditDepartmentRepositoryPort {
  constructor(private readonly db: typeof prisma) {}
  findById(departmentId: string) {
    return this.db.department.findFirst({
      where: { id: departmentId, deletedAt: null },
      select: { id: true, name: true },
    });
  }
  update(
    departmentId: string,
    data: { name?: string; description?: string | null },
    accountIdUpdater: string,
  ) {
    const now = new Date();
    return this.db.department.update({
      where: { id: departmentId },
      data: { ...data, accountIdUpdater, updatedAt: now },
    });
  }
}
