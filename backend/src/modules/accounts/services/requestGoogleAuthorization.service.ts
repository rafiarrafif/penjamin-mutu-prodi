import { generateCodeVerifier, generateState } from "arctic";
import { getGoogleProvider } from "../../../utils/googleOAuth";
import { getRedisClient, getRedisKey } from "../../../utils/redis";

const OAUTH_STATE_TTL_SECONDS = 600;
const GOOGLE_SCOPES = ["openid", "profile", "email"];

export async function requestGoogleAuthorization(): Promise<{
  state: string;
  authorizationUrl: string;
}> {
  const google = getGoogleProvider();
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authorizationUrl = google.createAuthorizationURL(
    state,
    codeVerifier,
    GOOGLE_SCOPES,
  );
  const redis = await getRedisClient();
  const stored = await redis.set(
    getRedisKey("oauth", "google", "pkce", state),
    codeVerifier,
    { EX: OAUTH_STATE_TTL_SECONDS, NX: true },
  );

  if (stored !== "OK") {
    throw new Error("Could not initialize the Google authorization flow");
  }

  return { state, authorizationUrl: authorizationUrl.toString() };
}
