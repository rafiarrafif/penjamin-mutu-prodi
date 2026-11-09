import { createSessionRecord } from "../repositories/sessions.repository";

interface CreateSessionInput {
  accountId: string;
  userAgent: string | null;
  ipAddress: string | null;
}

function getDeviceType(userAgent: string | null): string {
  if (!userAgent) return "desktop";
  if (/smart-tv|smarttv|hbbtv|appletv|googletv/i.test(userAgent)) return "tv";
  if (/ipad|tablet|kindle|playbook/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
}

function getDeviceOs(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/windows/i.test(userAgent)) return "Windows";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/macintosh|mac os/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function getBrowser(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/chrome\//i.test(userAgent)) return "Chrome";
  if (/safari\//i.test(userAgent)) return "Safari";
  return "Other";
}

export function createSession({
  accountId,
  userAgent,
  ipAddress,
}: CreateSessionInput) {
  return createSessionRecord({
    accountId,
    deviceType: getDeviceType(userAgent),
    deviceOs: getDeviceOs(userAgent),
    browser: getBrowser(userAgent),
    ipAddress,
  });
}
