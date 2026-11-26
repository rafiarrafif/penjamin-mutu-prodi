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
  const redirectUri = process.env.GOOGLE_REDIRECT_URL?.trim();

  if (!clientId || !clientSecret)
    throw new Error("Google OAuth credentials are not configured");
  if (!redirectUri) throw new Error("GOOGLE_REDIRECT_URL is not configured");

  return new Google(clientId, clientSecret, redirectUri);
}
