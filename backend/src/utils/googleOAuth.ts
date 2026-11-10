import "dotenv/config";
import { Google } from "arctic";

export const GOOGLE_CALLBACK_PATH = "/accounts/auth/callback/google";

export function getGoogleProvider(): Google {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.APP_URL?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured");
  }

  if (!appUrl) {
    throw new Error("APP_URL is not configured");
  }

  const destination = appUrl.replace(/\/+$/, "");
  const redirectUri = new URL(
    `${destination}${GOOGLE_CALLBACK_PATH}`,
  ).toString();

  return new Google(clientId, clientSecret, redirectUri);
}
