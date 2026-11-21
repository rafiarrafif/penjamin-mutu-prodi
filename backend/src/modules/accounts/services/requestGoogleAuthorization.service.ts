import { getGoogleProvider } from "../../../utils/googleOAuth";
import { getRedisClient, getRedisKey } from "../../../utils/redis";

export class RequestGoogleAuthorizationService {
  async execute(): Promise<{ state: string; authorizationUrl: string }> {
    const { generateCodeVerifier, generateState } = await import("arctic");
    const google = await getGoogleProvider();
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const authorizationUrl = google.createAuthorizationURL(
      state,
      codeVerifier,
      ["openid", "profile", "email"],
    );
    const redis = await getRedisClient();
    const stored = await redis.set(
      getRedisKey("oauth", "google", "pkce", state),
      codeVerifier,
      { EX: 600, NX: true },
    );

    if (stored !== "OK") {
      throw new Error("Could not initialize the Google authorization flow");
    }

    return { state, authorizationUrl: authorizationUrl.toString() };
  }
}
