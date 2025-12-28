import express from "express";
import { handlePRWebhook } from "../../src/pr_analyzer/handler";
import { Octokit } from "octokit";
import { getUserIdFromToken } from "../../src/auth/jwt";
import { getUsersCollection } from "../../src/auth/users";
import { redisClient } from "../../src/utils/redis";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const router = express.Router();

function parseRepoString(repoRaw:any) {
  if (!repoRaw || typeof repoRaw !== "string") {
    throw new Error("Invalid repo string");
  }

  // remove possible URL prefix and trailing slash
  let repo = repoRaw
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\/+$/, "");

  const parts = repo.split("/");
  if (parts.length !== 2) {
    throw new Error("Invalid repo format. Expected owner/repo");
  }

  const owner = parts[0].trim();
  const repoName = parts[1].trim();

  if (!owner || !repoName) throw new Error("Invalid owner or repo name");

  return { owner, repoName };
}

router.post("/connect", async (req, res) => {
  const { repo } = req.body;

  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: "Missing token" });
  const userId = await getUserIdFromToken(auth);
  if (!userId) return res.status(401).json({ error: "Invalid token" });
    const users = await getUsersCollection();

  const record = await users.findOne({_id: userId });
  const githubAccessToken = record?.oauth.github.githubAccessToken;

  if (!repo) return res.status(400).json({ error: "Repo is required" });
  if (!githubAccessToken) return res.status(400).json({ error: "GitHub access token is required" });

  const octo = new Octokit({ auth: githubAccessToken });
  let webhook;

  const [owner, repoName] = repo.split("/");
  console.log(owner, repoName);
  owner.trim();
  repoName.trim();
  console.log(owner, repoName);
  console.log("Creating webhook for", repo);
  console.log("Webhook URL:", process.env.WEBHOOK_URL);
    try {
    const response = await octo.request("GET /repos/{owner}/{repo}", {
      owner,
      repo: repoName,
    });
    console.log("Repo lookup successful:", response.data.full_name);
  } catch (err) {
    console.error("Repo lookup failed — token may lack access or repo doesn't exist", {
      owner,
      repoName,
      error: err,
    });
    throw err;
  }

//   const hooks = await octo.request("GET /repos/{owner}/{repo}/hooks", {
//   owner,
//   repo: repoName
// });
// console.log("Existing hooks:", hooks.data);

const userInfo = await octo.request("GET /user");
console.log("Scopes:", userInfo.headers["x-oauth-scopes"]);



   webhook = await octo.request("POST /repos/{owner}/{repo}/hooks", {
    owner: owner,
    repo: repoName,
    config: {
      url: process.env.WEBHOOK_URL,
      content_type: "json",
      secret: process.env.WEBHOOK_SECRET,
    },
    events: ["pull_request"],
  });
  console.log("Webhook created:", webhook.data.id);



  await users.updateOne(
    {   _id: userId, type: "user" },
    {
      $set: {
        "prAnalyzer": {
          connected: true,
          repo,
          webhookId: webhook.data.id,
        },
      },
    },
  );
  res.json({ message: "Repository connected.", webhookId: webhook.data.id});
});

router.post("/disconnect", async (req: any, res) => {
  const { repo } = req.body;
  if (!repo) return res.status(400).json({ error: "Repo is required" });

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });

  const userId = await getUserIdFromToken(auth);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  const users = await getUsersCollection();
  const record = await users.findOne({ type: "user", _id: userId });

  const githubAccessToken = record?.oauth?.github?.githubAccessToken;
  const webhookId = record?.prAnalyzer?.webhookId;

  if (!githubAccessToken) {
    return res.status(400).json({ error: "GitHub account not connected" });
  }
  if (!webhookId) {
    return res.status(400).json({ error: "No webhook found for this user" });
  }

  const octo = new Octokit({ auth: githubAccessToken });

  const [rawOwner, rawRepo] = repo.split("/");
  const owner = rawOwner.trim();
  const repoName = rawRepo.trim();

  console.log("Attempting webhook delete:", { owner, repoName, webhookId });

  try {
    // Ensure hook id is a number
    const hookIdNum = Number(webhookId);

    // Fetch existing hooks to confirm and provide better logging
    const existing = await octo.request("GET /repos/{owner}/{repo}/hooks", {
      owner,
      repo: repoName,
    });
    console.log("Existing hooks:", existing.data.map((h: any) => ({ id: h.id, url: h.config?.url })));

    // Try to find hook by id or by matching webhook URL
    const found = existing.data.find((h: any) => h.id === hookIdNum || h.config?.url === process.env.WEBHOOK_URL);

    if (!found) {
      console.warn("Webhook not found on repo; nothing to delete");
    } else {
      const targetId = found.id;
      await octo.request("DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {
        owner,
        repo: repoName,
        hook_id: targetId,
      });
      console.log("Webhook deleted successfully", targetId);
    }
  } catch (err: any) {
    console.error("Failed to delete webhook:", err.response?.data || err);
  }

  await users.updateOne(
    { _id: userId, type: "user" },
    { $unset: { "prAnalyzer.connected": "", "prAnalyzer.repo": "", "prAnalyzer.webhookId": "" } }
  );

  res.json({ message: "Repository disconnected." });
});

router.get("/status", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.json({ connected: false, repo: "" });

  const userId = await getUserIdFromToken(token);
  if (!userId) return res.json({ connected: false, repo: "" });

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: userId });

  return res.json({
    connected: user?.prAnalyzer?.connected || false,
    repo: user?.prAnalyzer?.repo || "",
  });
});



router.get("/fetch/:repo", async (req, res) => {

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });

  const userId = await getUserIdFromToken(auth);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  const {repo} = req.params as { repo: string };
  const parsedRepo = decodeURIComponent(repo);
  
  if (!parsedRepo) return res.status(400).json({ error: "Repo is required" });

  try{
    const cacheKey = `prs:${parsedRepo}`;
    const cache = await redisClient.get(cacheKey);
    if (cache) {
      console.log("Returning cached PRs for", parsedRepo);
      return res.json({prs: JSON.parse(cache)});
    }
    console.log("Fetching PRs from GitHub for", parsedRepo);

    const prs = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: parsedRepo.split('/')[0],
      repo: parsedRepo.split('/')[1],
      state: 'open',
  }); 
  const response = {prs: prs.data };
  await redisClient.set(cacheKey, JSON.stringify(response), { EX: 180 });

   return res.json(response);
  } catch (error){
    res.status(500).json({ error: "Failed to fetch pull requests" });
  }
});

router.get("/repos", async (req: any, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });

  const userId = await getUserIdFromToken(auth);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  const users = await getUsersCollection();
  const record = await users.findOne({_id: userId });

  const githubAccessToken = record?.oauth.github.githubAccessToken;
  if (!githubAccessToken)
    return res.status(400).json({ error: "GitHub is not connected" });
  console.log("GitHub access token found", githubAccessToken.substring(0, 4) + "...");

  const cacheKey = `repos:${userId}`;
  const cache = await redisClient.get(cacheKey);
  if (cache) {
    console.log("Returning cached repos");
    return res.json({ repos: JSON.parse(cache), userId: record?.oauth.github.id });
  }

  const octo = new Octokit({ auth: githubAccessToken });
  const repos = await octo.request("GET /user/repos");
  const githubId = record?.oauth.github.id;

  const response = {repos: repos.data, userId: githubId };

  await redisClient.set(cacheKey, JSON.stringify(response), { EX: 180 });

  res.json({repos: repos.data, userId: githubId });
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

  handlePRWebhook(pr).catch((error: any) => {
    console.error("Error handling PR Webhook:", error);
    res.status(500).send("Internal server error.");
  });

});


export default router;
