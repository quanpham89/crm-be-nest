// config/bull.config.ts
export const bullConfig = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,                    // Retry 3 lần nếu thất bại
    backoff: {
      type: 'exponential',
      delay: 1000,                  // 1s, 2s, 4s...
    },
    removeOnComplete: 100,          // Giữ 100 job hoàn thành
    removeOnFail: 500,              // Giữ 500 job thất bại để debug
  },
};