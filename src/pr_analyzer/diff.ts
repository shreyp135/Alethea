import {Octokit} from "octokit";

const githubToken = process.env.GITHUB_TOKEN;
const octo = new Octokit({auth: githubToken});

export async function getPRDiff(pr: any): Promise<string> {
    const response = await octo.rest.pulls.get({
        owner: pr.base.repo.owner.login,
        repo: pr.base.repo.name,
        pull_number: pr.number,
        mediaType: {format: 'diff'},
    });
    return response.data as unknown as string;
}