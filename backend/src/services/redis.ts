import { createClient } from "redis";
import { logger } from "../utils/logger.js";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
let client: ReturnType<typeof createClient> | null = null;
let isConnected = false;
let hasWarnedError = false;

if (!redisUrl.includes("mock")) {
  client = createClient({ url: redisUrl });
  client.on("error", (err: Error) => {
    if (!hasWarnedError) {
      logger.warn("Redis client warning, caching disabled", { message: err.message });
      hasWarnedError = true;
    }
    isConnected = false;
  });
  client
    .connect()
    .then(() => {
      logger.info("Connected to Redis cache");
      isConnected = true;
      hasWarnedError = false;
    })
    .catch((err: Error) => {
      if (!hasWarnedError) {
        logger.warn("Failed to connect to Redis — falling back to direct DB queries", {
          message: err.message,
        });
        hasWarnedError = true;
      }
      isConnected = false;
    });
}

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    if (!isConnected || !client) return null;
    try {
      const data = await client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  }

  static async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
    if (!isConnected || !client) return;
    try {
      await client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  static async del(key: string): Promise<void> {
    if (!isConnected || !client) return;
    try {
      await client.del(key);
    } catch {
      // ignore
    }
  }

  static async clearPattern(pattern: string): Promise<void> {
    if (!isConnected || !client) return;
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch {
      // ignore
    }
  }
}

export function getRedisStatus() {
  return { isConnected, initialized: !!client };
}
