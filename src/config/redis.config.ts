import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  ttl: {
    product: 30 * 60 * 1000, // 30 minutes in ms
    productsList: 60 * 60 * 1000, // 60 minutes in ms
    search: 30 * 60 * 1000,
    session: 24 * 60 * 60 * 1000,
  },
}));
