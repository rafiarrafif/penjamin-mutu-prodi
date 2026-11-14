import { findActiveSessionRecord } from "../repositories/findActiveSession.repository";

export function findActiveSession(sessionId: string) {
  return findActiveSessionRecord(sessionId);
}