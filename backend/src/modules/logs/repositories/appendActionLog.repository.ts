import { prisma } from "../../../utils/prisma";

export interface AppendActionLogRecord {
  accountIdRelated: string;
  sessionIdRelated: string;
  tableIdRelated: string;
  tableName: string;
  action: "create" | "update" | "delete";
  description: string;
}

export interface AppendActionLogRepositoryPort {
  append(record: AppendActionLogRecord): Promise<unknown>;
}

export class AppendActionLogRepository implements AppendActionLogRepositoryPort {
  constructor(private readonly db: typeof prisma) {}

  append(record: AppendActionLogRecord) {
    return this.db.actionLog.create({
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
}
