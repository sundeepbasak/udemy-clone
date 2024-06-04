import { REDIS_URL } from '@/constants/config.constants';
import Redis from 'ioredis';

export const redis = new Redis(REDIS_URL)

// await redis.set("text", "This is a demo text");

// await redis.get("text").then((a) => console.log("aaaa", a));

