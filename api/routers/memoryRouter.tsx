import express from "express";
import { memoryClient } from "../../src/utils/mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await memoryClient.find({}).sort({ createdAt: -1 }).toArray();
  res.json(items);
});

export default router;
