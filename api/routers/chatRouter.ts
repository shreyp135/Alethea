import express from "express";
import {chatWithAlethea} from "../../src/chatbot/handler"
import { redisClient } from "../../src/utils/redis";


const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "question is required" });
  }
  
  const cacheKey = `chat:${question.trim().toLowerCase()}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log("Returning cached chat response");
    return res.json(JSON.parse(cached));
  }

  const result = await chatWithAlethea(question);
  
  await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });
  
  res.json(result);
});

export default router;
