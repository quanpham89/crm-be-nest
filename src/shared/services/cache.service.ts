import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private logger = new Logger(CacheService.name);
  private metrics = { hits: 0, misses: 0 };

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) {
        this.metrics.hits++;
        return value;
      }
      this.metrics.misses++;
      return null;
    } catch (error) {
      this.logger.error(`Cache get error for key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlMs);
    } catch (error) {
      this.logger.error(`Cache set error for key: ${key}`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key: ${key}`, error);
    }
  }

  private get store(): any {
    return (this.cacheManager as any).store || (this.cacheManager as any).stores?.[0];
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const store = this.store;
      if (store && typeof store.keys === 'function') {
        const keys = await store.keys(pattern);
        if (keys?.length) {
          await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
        }
        return;
      }
      this.logger.warn(`Pattern deletion not supported on current cache store: ${pattern}`);
    } catch (error) {
      this.logger.error(`Cache pattern delete error for pattern: ${pattern}`, error);
    }
  }

  async flush(): Promise<void> {
    try {
      const store = this.store;
      if (store && typeof store.flushdb === 'function') {
        await store.flushdb();
        return;
      }
      if (typeof (this.cacheManager as any).reset === 'function') {
        await (this.cacheManager as any).reset();
        return;
      }
      this.logger.warn('Flush not supported by current cache store.');
    } catch (error) {
      this.logger.error('Cache flush error', error);
    }
  }

  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    const hitRate = total > 0 ? ((this.metrics.hits / total) * 100).toFixed(2) : '0';
    return {
      hits: this.metrics.hits,
      misses: this.metrics.misses,
      hitRate: `${hitRate}%`,
    };
  }

  resetMetrics() {
    this.metrics = { hits: 0, misses: 0 };
  }
}
