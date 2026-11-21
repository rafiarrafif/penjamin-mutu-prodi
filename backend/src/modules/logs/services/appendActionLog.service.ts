import type {
  AppendActionLogRecord,
  AppendActionLogRepositoryPort,
} from "../repositories/appendActionLog.repository";

export class AppendActionLogService {
  constructor(private readonly repository: AppendActionLogRepositoryPort) {}

  execute(record: AppendActionLogRecord) {
    return this.repository.append(record);
  }
}
