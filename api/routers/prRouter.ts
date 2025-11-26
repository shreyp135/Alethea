import express from "express";
import { handlePRWebhook } from "../../src/pr_analyzer/handler";
import {memoryClient} from "../../src/utils/mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const prs = await memoryClient.find({ type: "pr" }).sort({ createdAt: -1 }).toArray();
  res.json(prs);
});

router.get("/link", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  res.json({ linked: true });
});


router.post("/webhook", async (req, res) => {
  const payload = req.body;
  const pr = payload.pull_request;
  if (!pr) {
    return res.status(400).send("No pull request data found.");
  }
  if (pr.state !== "open") {
    return res.status(200).send("PR is closed, no action taken.");
  }
  if (pr.state === "open") {
    res.status(201).send("PR Recieved successfully.");
  }

  handlePRWebhook(pr, res).catch((error: any) => {
    console.error("Error handling PR Webhook:", error);
    res.status(500).send("Internal server error.");
  });

});


export default router;
