import type { prisma } from "../../../utils/prisma";

export class DeleteRequirementRepository {
  constructor(private readonly db: typeof prisma) {}
  findDeletable(id: string) {
    return this.db.dataRequirement.findFirst({
      where: { id, deletedAt: null },
    });
  }
  async softDeleteWithPics(id: string, accountId: string, sessionId: string) {
    return this.db.$transaction(async (tx) => {
      const now = new Date();
      const pics = await tx.departmentPic.findMany({
        where: { dataRequirementId: id, deletedAt: null },
        select: { departmentId: true, dataRequirementId: true },
      });
      await tx.departmentPic.updateMany({
        where: { dataRequirementId: id, deletedAt: null },
        data: { deletedAt: now, updatedAt: now },
      });
      const requirement = await tx.dataRequirement.update({
        where: { id },
        data: { deletedAt: now, updatedAt: now },
      });
      for (const pic of pics)
        await tx.actionLog.create({
          data: {
            id: crypto.randomUUID(),
            accountIdRelated: accountId,
            sessionIdRelated: sessionId,
            tableIdRelated: `${pic.departmentId}:${pic.dataRequirementId}`,
            tableName: "department_pics",
            action: "delete",
            description: `Soft deleted PIC assignment for department "${pic.departmentId}" and data requirement "${pic.dataRequirementId}".`,
            createdAt: now,
          },
        });
      await tx.actionLog.create({
        data: {
          id: crypto.randomUUID(),
          accountIdRelated: accountId,
          sessionIdRelated: sessionId,
          tableIdRelated: id,
          tableName: "data_requirements",
          action: "delete",
          description: `Soft deleted data requirement "${requirement.name}".`,
          createdAt: now,
        },
      });
      return requirement;
    });
  }
}
