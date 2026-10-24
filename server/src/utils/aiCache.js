
import { createHash } from "node:crypto";

const CACHE_TTL = 15 * 60 * 1000;
const MAX_ENTRIES = 200;

const cache = new Map();
const pendingRequests = new Map();

export function createWeatherCacheKey(context) {
  return createHash("sha256")
    .update(JSON.stringify(context))
    .digest("hex");
}

export function getCachedBrief(key) {
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedBrief(key, data) {
  for (const [entryKey, entry] of cache) {
    if (Date.now() >= entry.expiresAt) {
      cache.delete(entryKey);
    }
  }

  if (cache.has(key)) {
    cache.delete(key);
  }

  if (cache.size >= MAX_ENTRIES) {
    cache.delete(cache.keys().next().value);
  }

  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL,
  });
}

export function getPendingRequest(key) {
  return pendingRequests.get(key);
}

export function setPendingRequest(key, promise) {
  pendingRequests.set(key, promise);
}

export function clearPendingRequest(key) {
  pendingRequests.delete(key);
}
