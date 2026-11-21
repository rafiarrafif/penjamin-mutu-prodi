import {
  appendActionLog as appendActionLogRecord,
  type AppendActionLogRecord,
} from "../repositories/appendActionLog.repository";

export function appendActionLog(record: AppendActionLogRecord) {
  return appendActionLogRecord(record);
}
