import { getPRDiff } from "../pr_analyzer/diff";
import { assessRisk } from "../pr_analyzer/risk";
import { generatePRStory } from "../pr_analyzer/pr_story";
import { commentOnPR } from "../pr_analyzer/comment";
import { storePR } from "src/memory/store";

export async function handlePRWebhook(pr: any, res: any) {
  console.log(`Received PR #${pr.number}: ${pr.title}`);
  //   console.log(pr);
  const diff = await getPRDiff(pr);
  const risk = assessRisk(diff);
  const story = await generatePRStory(diff, risk);
  await commentOnPR(pr, story);
  await storePR(diff, {
    repo: pr.base.repo.full_name,
    prNumber: pr.number,
    title: pr.title,
    author: pr.user.login,
    heuristic: risk,
  });
  console.log(`Processed PR #${pr.number} successfully.`);
}
