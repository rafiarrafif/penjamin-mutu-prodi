import {
  findSessionById,
  revokeSessionRecord,
} from "../repositories/revokeCurrent.repository";

export async function revokeCurrent(sessionId: string) {
  const session = await findSessionById(sessionId);

  if (!session) {
    throw new Error("Session not found or already revoked.");
  }

  if (session.revokedAt) {
    throw new Error("Session is already revoked.");
  }

  const revokedSession = await revokeSessionRecord(sessionId);

  return revokedSession;
}
