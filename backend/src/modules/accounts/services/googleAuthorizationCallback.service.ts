import { getGoogleProvider } from "../../../utils/googleOAuth";
import { getRedisClient, getRedisKey } from "../../../utils/redis";
import type { UpdateGoogleAccountForLoginRepositoryPort } from "../repositories/updateGoogleAccountForLogin.repository";
import type { CreateSessionService } from "../../sessions/services/createSession.service";

export class GoogleAuthorizationCallbackService {
  constructor(
    private readonly accountRepository: UpdateGoogleAccountForLoginRepositoryPort,
    private readonly sessionService: CreateSessionService,
  ) {}

  async exchangeCode(code: string, state: string): Promise<unknown> {
    const redis = await getRedisClient();
    const codeVerifier = await redis.getDel(
      getRedisKey("oauth", "google", "pkce", state),
    );
    if (!codeVerifier)
      throw Object.assign(
        new Error(
          "The Google authorization request expired or was already used.",
        ),
        { statusCode: 400 },
      );
    const google = await getGoogleProvider();
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${tokens.accessToken()}` } },
    );
    if (!profileResponse.ok)
      throw new Error("Google user profile could not be retrieved");
    return profileResponse.json();
  }

  async createLoginSession(
    email: string,
    sub: string,
    profilePicture: string | null,
    userAgent: string | null,
    ipAddress: string | null,
  ) {
    const account = await this.accountRepository.update(
      email,
      sub,
      profilePicture,
    );
    if (!account) return null;
    const session = (await this.sessionService.execute({
      accountId: (account as { id: string }).id,
      userAgent,
      ipAddress,
    })) as { id: string };
    return { sessionId: session.id, account };
  }
}
