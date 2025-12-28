"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../ui/loader/Loader";


export default function PRList() {
  const [prs, setPrs] = useState<any[]>([]);
  const [repo, setRepo] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

useEffect(() => {
    const githubRepo = localStorage.getItem("alethea_github_repo");
    if( githubRepo){
        setRepo(githubRepo);
        setConnected(true);
        console.log("Connected repo found:", githubRepo);
        console.log("setting connected to true");
    }
}, []);

useEffect(() => {
  if (!connected || !repo) return;

  const encodedRepo = encodeURIComponent(repo);
  setLoaderVisible(true);

  axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/fetch/${encodedRepo}`, {
      headers: { Authorization: localStorage.getItem("alethea_access") || "" },
    })
    .then((res) => setPrs(res.data.prs || []))
    .catch((err) => {
      console.error("PR fetch error:", err);
      console.error("Axios response:", err.response?.data);
    })
    .finally(() => {
      setLoaderVisible(false);
    });
    setLoaderVisible(false);
}, [connected]);

  if (!connected) {
    return (
      <div className="p-6 border dark:border-gray-700 rounded-lg shadow-sm">
        <p className="text-gray-700 dark:text-gray-300">
          Connect a repository to view recent PRs and automatically analyze them.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border dark:border-gray-700 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Recent Pull Requests
      </h2>
      {loaderVisible && <div className="ml-8"><Loader /></div>}
      {!loaderVisible && <>
      {prs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No PRs found in {repo}.</p>
      ) : (
        <div className="space-y-4">
          {prs.map((pr: any) => (
            <a
              key={pr.number}
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <p className="font-medium">#{pr.number} — {pr.title}</p>

              <div className="flex items-center gap-2 mt-1">
                <img
                  src={pr.user?.avatar_url}
                  alt={pr.user?.login}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pr.user?.login}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}</>}

      <p className="text-xs text-gray-500 mt-4">
        Currently only one repo can be displayed in the dashboard although we will still process PRs from ANY connected repos via webhook.
      </p>
    </div>
  );
}