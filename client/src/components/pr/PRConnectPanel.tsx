"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SelectInputs from "../form/form-elements/SelectInputs";
import { access } from "fs";

export default function PRConnectPanel() {
  const [github_linked, setGithubLinked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [repo, setRepo] = useState("");
  const [repos, setRepos] = useState<{ value: string; label: string }[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  useEffect(() => {
    const githubToken = localStorage.getItem("alethea_github");
    const accessToken = localStorage.getItem("alethea_access");
    if (githubToken) 
        setGithubLinked(true);
    // attempt to load available repos for the user
    const fetchRepos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/repos`, {
          headers: {
            Authorization: accessToken,
          },
        });
        
        // expected shape: [{ value, label }]
        if (res && res.data) {
        const {repos, userId} = res.data;

            const filteredRepos = repos.filter((r: any) => r.owner.id == userId);
            const repoOptions = filteredRepos.map((r: any) => ({
                value: r.full_name,
                label: r.full_name,
            }));
            setRepos(repoOptions);
        }
      } catch (e) {
        // fallback example repos
        setRepos([
          { value: "error finding repos", label: "error finding repos" },
        ]);
      }
    };
    fetchRepos();
  }, []);

  const connectRepo = async () => {
    const repoUrl = selectedRepo || repo;
    if (!repoUrl) {
      alert("Please select a repository to connect.");
      return;
    }

    await axios.post( `${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/connect`,   { repo: repoUrl,  }, {
      headers: {
        Authorization: localStorage.getItem("alethea_access") || "",
      },
    });

    setConnected(true);
    setRepo(repoUrl);
  };

  const disconnectRepo = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/disconnect`,{repo:selectedRepo || repo}, {
      headers: {
        Authorization: localStorage.getItem("alethea_access") || "",
      },
    });
    setConnected(false);
    setRepo("");
  };


  return (
    <div className="p-6 border rounded-lg dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Repository Settings</h2>
      {!github_linked ? (
        <div>
          <p className="text-gray-700 dark:text-gray-400 mb-3">
            Your GitHub account is not linked. Please connect your GitHub account to manage repositories.
          </p>
          <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`}>
          <button   
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-800 hover:dark:bg-blue-900 text-white rounded-md"
          >
            Connect GitHub Account
          </button>
          </a>
        </div>
      ) : ( <>{connected ? (
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Connected Repo:</strong> {repo}
          </p>
          <button
            onClick={disconnectRepo}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Disconnect Repository
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 dark:text-gray-400 mb-3">
            Select a repository to connect for PR analysis.
          </p>
          <SelectInputs
            options={repos}
            value={selectedRepo}
            onChange={(v) => setSelectedRepo(v)}
            placeholder="Select repository"
          />
          <button
            onClick={connectRepo}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-800 hover:dark:bg-blue-900 text-white rounded-md mt-3"
          >
            Link Repository
          </button>
        </div>
      )}</>
      )}

    </div>
  );
}
