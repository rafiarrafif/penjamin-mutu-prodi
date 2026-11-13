import { getGoogleProvider } from "../../../utils/googleOAuth";
import { getRedisClient, getRedisKey } from "../../../utils/redis";
import { createSession } from "../../sessions/services/createSession.service";
import { updateGoogleAccountForLogin } from "../repositories/updateGoogleAccountForLogin.repository";

export async function exchangeGoogleAuthorizationCode(
  code: string,
  state: string,
): Promise<unknown> {
  const redis = await getRedisClient();
  const codeVerifier = await redis.getDel(
    getRedisKey("oauth", "google", "pkce", state),
  );

  if (!codeVerifier) {
    const error = Object.assign(
      new Error(
        "The Google authorization request expired or was already used.",
      ),
      { statusCode: 400 },
    );
    throw error;
  }

  const tokens = await getGoogleProvider().validateAuthorizationCode(
    code,
    codeVerifier,
  );
  const profileResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${tokens.accessToken()}` } },
  );

  if (!profileResponse.ok) {
    throw new Error("Google user profile could not be retrieved");
  }

  return profileResponse.json();
}

export async function createGoogleLoginSession(
  email: string,
  sub: string,
  profilePicture: string | null,
  userAgent: string | null,
  ipAddress: string | null,
) {
  const account = await updateGoogleAccountForLogin(email, sub, profilePicture);
  if (!account) return null;

  const session = await createSession({
    accountId: account.id,
    userAgent,
    ipAddress,
  });

  return {
    sessionId: session.id,
    account,
  };
}
