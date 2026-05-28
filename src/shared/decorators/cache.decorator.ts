import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'custom_cache_key';
export const CACHE_TTL = 'custom_cache_ttl';

export const CacheResponse = (key: string, ttlSeconds = 300) =>
  SetMetadata(CACHE_KEY, key);

export const CacheTtl = (ttlSeconds: number) =>
  SetMetadata(CACHE_TTL, ttlSeconds);
