"use client";

import { useEffect, useState } from "react";
import axios from "axios";


export default function PRList() {
  const [prs, setPrs] = useState<any[]>([]);
  const [repo, setRepo] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // axios.get("/api/pr-analyzer/status").then((res) => {
    //   setConnected(res.data.connected);
    //   setRepo(res.data.repo || "");
    const r = localStorage.getItem("alethea_github_repo");
    if (r) {
      setRepo(r);
      setConnected(true);
    }
  }, []);

  useEffect(() => {
    if (!connected || !repo) return;    
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/}`, {
      params: { repo },
      headers: {
        Authorization: localStorage.getItem("alethea_access") || "",
      },
    })
    .then((res) => {
      setPrs(res.data || []);
    });
  }, [connected, repo]);

  if (!connected) {
    return (
      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <p className="text-gray-700">
          Connect a repository to view recent PRs and automatically analyze them.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Pull Requests</h2>

      {prs.length === 0 ? (
        <p className="text-gray-600">No PRs found in {repo}.</p>
      ) : (
        <div className="space-y-4">
          {prs.map((pr: any) => (
            <a
              key={pr.number}
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded-md hover:bg-gray-50"
            >
              <p className="font-medium">#{pr.number} — {pr.title}</p>
              <p className="text-sm text-gray-600 mt-1">{pr.user}</p>
            </a>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Currently only one repo can be displayed in dashboard.  
        However, the analyzer will still process PRs from ANY connected repos via webhook.
      </p>
    </div>
  );
}
