import express from "express";
import {memoryClient} from "../../src/utils/mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const inc = await memoryClient.find({ type: "incident" }).sort({ createdAt: -1 }).toArray();
  res.json(inc);
});

export default router;
