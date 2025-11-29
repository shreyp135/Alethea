import express from "express";
import { handlePRWebhook } from "../../src/pr_analyzer/handler";
import { Octokit } from "octokit";
import { getUserIdFromToken } from "../../src/auth/jwt";
import { getUsersCollection } from "../../src/auth/users";

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
  const repo = req.body.repo;
  if (!repo) return res.status(400).json({ error: "Repo is required" });
  
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });
  const userId = await getUserIdFromToken(auth);
  if (!userId) return res.status(401).json({ error: "Invalid token" });
    const users = await getUsersCollection();

    const record = await users.findOne({
    type: "user",
    _id: userId,
  });
  const githubAccessToken = record?.oauth.github.githubAccessToken;
  const webhookId = record?.prAnalyzer?.webhookId;
  const octo = new Octokit({ auth: githubAccessToken });
  const [owner, repoName] = repo.split("/");


  try {
    await octo.request("DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {
      owner,
      repo: repoName,
      hook_id: webhookId,
    });
  } catch {}

  await users.updateOne(
    { _id: userId, type: "user" },
    {
      $unset: { "prAnalyzer.connected": "", "prAnalyzer.repo": "", "prAnalyzer.webhookId": "" },
    }
  );
  res.json({ message: "Repository disconnected." });
});



router.get("/", async (req, res) => {

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });
  const userId = await getUserIdFromToken(auth);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  const {repo} = req.headers as { repo: string };
  if (!repo) return res.status(400).json({ error: "Repo is required" });

  try{

    const prs = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: repo.split('/')[0],
      repo: repo.split('/')[1],
      state: 'open',
  }); 
      const formatted = prs.data.map((p: any) => ({
      number: p.number,
      title: p.title,
      user: p.user?.login,
      html_url: p.html_url,
    }));

    res.json({prs: formatted});
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

  const octo = new Octokit({ auth: githubAccessToken });

  const repos = await octo.request("GET /user/repos");
  const githubId = record?.oauth.github.id;

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
