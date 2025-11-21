import express from "express";
import { get } from "http";
import { getPRDiff } from "../pr_analyzer/diff";
import { assessRisk } from "../pr_analyzer/risk";
import { generatePRStory } from "../pr_analyzer/pr_story";
import {commentOnPR } from "../pr_analyzer/comment";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;
    const pr = payload.pull_request;
    if (!pr) {
      return res.status(400).send("No pull request data found.");
    }
    console.log(`Received PR #${pr.number}: ${pr.title}`);
    const diff = getPRDiff(pr);
    const risk = assessRisk(diff);
    const story = await generatePRStory(diff, risk);
    await commentOnPR(pr, story);

    res.status(200).send("PR analyzed and commented.");
  } catch (error) {
    console.error("Error processing PR:", error);
    res.status(500).send("Internal server error.");
  }
});

app.listen(PORT, () => {
  console.log(`Alethea PRA Server is running on port ${PORT}`);
});
