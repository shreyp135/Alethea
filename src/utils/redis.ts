import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 15455,
    }
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on('error', err => console.log('Redis Client Error', err));


