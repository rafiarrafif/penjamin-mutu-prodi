import "dotenv/config";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createRedisClient> | undefined;
let redisConnection: Promise<ReturnType<typeof createRedisClient>> | undefined;

export function getRedisKey(...segments: string[]): string {
  const normalizedSegments = segments
    .map((segment) => segment.trim().replace(/^:+|:+$/g, ""))
    .filter(Boolean);

  if (normalizedSegments.length === 0) {
    throw new Error("A Redis key must contain at least one segment");
  }

  return normalizedSegments.join(":");
}

function createRedisClient() {
  const appName = process.env.APP_NAME?.trim();
  const host = process.env.REDIS_HOST;
  const port = Number(process.env.REDIS_PORT ?? 6379);
  const database = Number(process.env.REDIS_DB ?? 0);

  if (
    !appName ||
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !Number.isInteger(database) ||
    database < 0
  ) {
    throw new Error("Redis connection is not configured correctly");
  }

  const password = process.env.REDIS_PASSWORD;
  const username = process.env.REDIS_USERNAME;

  const client = createClient({
    keyPrefix: `${appName}:`,
    socket: {
      host,
      port,
      reconnectStrategy: (retries) =>
        retries >= 2 ? false : 100 * (retries + 1),
    },
    database,
    ...(password ? { password, ...(username ? { username } : {}) } : {}),
  });

  client.on("error", () => {
    console.error("Redis connection error");
  });

  return client;
}

export async function getRedisClient(): Promise<
  ReturnType<typeof createRedisClient>
> {
  const client = (redisClient ??= createRedisClient());

  if (!client.isOpen) {
    redisConnection ??= client
      .connect()
      .then(() => client)
      .catch((error: unknown) => {
        redisConnection = undefined;
        throw error;
      });

    await redisConnection;
  }

  return client;
}
