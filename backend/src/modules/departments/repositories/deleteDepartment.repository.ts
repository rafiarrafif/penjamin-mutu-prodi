import type { prisma } from "../../../utils/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export interface DeleteDepartmentRepositoryPort {
  findById(departmentId: string): Promise<{ id: string; name: string } | null>;
  deleteTransaction(
    departmentId: string,
  ): Promise<{ id: string; name: string }>;
}

export class DeleteDepartmentRepository implements DeleteDepartmentRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  findById(departmentId: string) {
    return this.db.department.findFirst({
      where: { id: departmentId, deletedAt: null },
      select: { id: true, name: true },
    });
  }

  async deleteTransaction(departmentId: string) {
    return this.db.$transaction(async (tx: Prisma.TransactionClient) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const activePicCount = await tx.departmentPic.count({
        where: {
          departmentId,
          deletedAt: null,
          department: { deletedAt: null },
          requirement: { deletedAt: null },
        },
      });
      if (activePicCount > 0) {
        throw Object.assign(
          new Error(
            "Department still has active PIC assignments. Unassign them before deleting the department.",
          ),
          { statusCode: 409 },
        );
      }

      await tx.departmentHistory.updateMany({
        where: {
          departmentId,
          deletedAt: null,
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
        data: { endDate: today, updatedAt: new Date() },
      });

      return tx.department.update({
        where: { id: departmentId },
        data: { deletedAt: new Date(), updatedAt: new Date() },
        select: { id: true, name: true },
      });
    });
  }
}
