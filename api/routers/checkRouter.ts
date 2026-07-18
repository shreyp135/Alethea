import express from 'express';
import { redisClient as redis } from '../../src/utils/redis';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
    });
  } catch {
    res.status(500).json({
      status: 'error',
    });
  }
});

router.get('/redis', async (_, res) => {
  try {
    await redis.ping();

    res.send('OK');
  } catch {
    res.status(500).json({
      status: 'error',
    });
  }
});

export default router;
