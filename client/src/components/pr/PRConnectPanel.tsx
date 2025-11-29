"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SelectInputs from "../form/form-elements/SelectInputs";
import toast, { ToastBar, Toaster } from "react-hot-toast";



export default function PRConnectPanel() {
  const [github_linked, setGithubLinked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [repo, setRepo] = useState("");
  const [repos, setRepos] = useState<{ value: string; label: string }[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  useEffect(() => {
    const githubToken = localStorage.getItem("alethea_github");
    const accessToken = localStorage.getItem("alethea_access");
    const githubRepo = localStorage.getItem("alethea_github_repo");
    if (githubToken) 
        setGithubLinked(true);
    if( githubRepo){
        setRepo(githubRepo);
        setConnected(true);
    }
    // attempt to load available repos for the user
    const fetchRepos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/repos`, {
          headers: {
            Authorization: accessToken,
          },
        });

        // expected shape: { repos, userId }
        if (res && res.data) {
          const { repos: repoList, userId } = res.data;
          const filteredRepos = Array.isArray(repoList)
            ? repoList.filter((r: any) => r.owner?.id == userId)
            : [];
          const repoOptions = filteredRepos.map((r: any) => ({
            value: r.full_name,
            label: r.full_name,
          }));
          setRepos(repoOptions);
          return;
        }

        throw new Error("Invalid response from repos API");
      } catch (err: any) {
        // show a useful error message in the UI/console to help debugging
        console.error("Failed to fetch repos:", err);
        const status = err?.response?.status;
        const data = err?.response?.data;
        // fallback example repos and show error label so user sees details
        setRepos([
          { value: "error finding repos", label: `error finding repos${status ? ` (status ${status})` : ""}` },
        ]);
        try {
          // lazy import react-hot-toast to avoid adding a hard dependency here if not present
          const toast = (await import("react-hot-toast")).default;
          toast.error(`Could not load repos${status ? ` (status ${status})` : ""}`);
        } catch (e) {
          // ignore toast errors
        }
        // also log response body if available
        if (data) console.error("Repos API response body:", data);
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

    const response = await axios.post( `${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/connect`, { repo: repoUrl,  }, {
      headers: {
        Authorization: localStorage.getItem("alethea_access"),
      },
    });
    if (response.status === 422) {
        toast.error("Repository connection failed. Please ensure the repository exists and the GitHub account has access.");
        return;
      }

    setConnected(true);
    setRepo(repoUrl);
    setGithubLinked(true);
    localStorage.setItem("alethea_github_repo", repoUrl);
    window.location.reload();
  };

  const disconnectRepo = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/disconnect`,{repo:selectedRepo || repo}, {
      headers: {
        Authorization: localStorage.getItem("alethea_access"),
      },
    });
    setConnected(false);
    setRepo("");
    setGithubLinked(false);
    localStorage.removeItem("alethea_github_repo");
    window.location.reload();
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
            className="px-4 py-2 bg-gray-500 hover:bg-red-600 hover:transition text-white rounded-md"
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
        <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
