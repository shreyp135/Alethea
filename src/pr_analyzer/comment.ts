import { Octokit } from "octokit";

const githubToken = process.env.GITHUB_TOKEN;
const octo = new Octokit({ auth: githubToken });

export async function commentOnPR(pr: any, body: string) {
  await octo.rest.issues.createComment({
    owner: pr.base.repo.owner.login,
    repo: pr.base.repo.name,
    issue_number: pr.number,
    body: `### Alethea PR Risk Analysis\n\n${body}`
  });
}
