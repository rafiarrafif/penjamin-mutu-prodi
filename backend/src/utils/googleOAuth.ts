import "dotenv/config";

export const GOOGLE_CALLBACK_PATH = "/accounts/auth/callback/google";

export interface GoogleOAuthProvider {
  validateAuthorizationCode(
    code: string,
    verifier: string,
  ): Promise<{ accessToken(): string }>;
  createAuthorizationURL(
    state: string,
    verifier: string,
    scopes: string[],
  ): URL;
}

export async function getGoogleProvider(): Promise<GoogleOAuthProvider> {
  const { Google } = await import("arctic");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.APP_URL?.trim();

  if (!clientId || !clientSecret)
    throw new Error("Google OAuth credentials are not configured");
  if (!appUrl) throw new Error("APP_URL is not configured");

  const redirectUri = new URL(
    `${appUrl.replace(/\/+$/, "")}${GOOGLE_CALLBACK_PATH}`,
  ).toString();
  return new Google(clientId, clientSecret, redirectUri);
}
