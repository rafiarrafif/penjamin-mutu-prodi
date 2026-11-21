import { prisma } from "../../../utils/prisma";

export interface AppendActionLogRecord {
  accountIdRelated: string;
  sessionIdRelated: string;
  tableIdRelated: string;
  tableName: string;
  action: "create" | "update" | "delete";
  description: string;
}

export function appendActionLog(record: AppendActionLogRecord) {
  return prisma.actionLog.create({
    data: {
      id: crypto.randomUUID(),
      accountIdRelated: record.accountIdRelated,
      sessionIdRelated: record.sessionIdRelated,
      tableIdRelated: record.tableIdRelated,
      tableName: record.tableName,
      action: record.action,
      description: record.description,
      createdAt: new Date(),
    },
  });
}
