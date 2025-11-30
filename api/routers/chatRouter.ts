import express from "express";
import {chatWithAlethea} from "../../src/chatbot/handler"

const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);
  
  // const result = await chatWithAlethea(question);
  const result = { answer: "This is a placeholder answer." };
  res.json(result);
});

export default router;
