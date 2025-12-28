"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SelectInputs from "../form/form-elements/SelectInputs";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../ui/loader/Loader";

export default function PRConnectPanel() {
  const [githubLinked, setGithubLinked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [repo, setRepo] = useState("");
  const [repos, setRepos] = useState<{ value: string; label: string }[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);

  // ----------------------------
  // Load initial states
  // ----------------------------
  useEffect(() => {
    const githubToken = localStorage.getItem("alethea_github");
    const connectedRepo = localStorage.getItem("alethea_github_repo");

    if (githubToken) setGithubLinked(true);
    if (connectedRepo) {
      setRepo(connectedRepo);
      setConnected(true);
    }
  }, []);

  // ----------------------------
  // Fetch repos IF GitHub is linked
  // ----------------------------
  useEffect(() => {
    if (!githubLinked) return;

    const accessToken = localStorage.getItem("alethea_access");
    if (!accessToken) return;

    const fetchRepos = async () => {
      setLoaderVisible(true);
      try {

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/repos`,
          { headers: { Authorization: accessToken } }
        );

        const { repos: list, userId } = res.data;
        // console.log("Fetched repos:", list);

        const ownRepos = list
          .filter((r: any) => r.owner?.id == userId)
          .map((r: any) => ({
            value: r.full_name,
            label: r.full_name,
          }));

        setRepos(ownRepos);
        setLoaderVisible(false);
      } catch (err: any) {
        console.error("Repo fetch error:", err.response?.data || err);
        toast.error("Failed to load GitHub repos")
        setLoaderVisible(false);
      }

    };

    fetchRepos();
  }, [githubLinked]);

  // ----------------------------
  // Connect repo
  // ----------------------------
  const connectRepo = async () => {
    const repoToConnect = selectedRepo || repo;
    if (!repoToConnect || repoToConnect.length === 0) {
      toast.error("Select a repository first.");
      return;
    }

    setLoading(true);


    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/connect`,
        { repo: repoToConnect },
        { headers: { Authorization: localStorage.getItem("alethea_access")! } }
      );

      setConnected(true);
      setRepo(repoToConnect);
      localStorage.setItem("alethea_github_repo", repoToConnect);
      toast.success("Repository connected!");
      setLoading(false);
      window.location.reload();
    } catch (err: any) {
      console.error("PR connect failed:", err.response?.data);
      toast.error("Failed to connect repository");
      setLoading(false);
    }
  };

  // ----------------------------
  // Disconnect repo
  // ----------------------------
  const disconnectRepo = async () => {
    setLoading(true);
    try {

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/disconnect`,
        { repo },
        { headers: { Authorization: localStorage.getItem("alethea_access")! } }
      );

      setConnected(false);
      setRepo("");
      localStorage.removeItem("alethea_github_repo");
      toast.success("Repository disconnected");
        setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error("Disconnect failed:", err);
      toast.error("Failed to disconnect repository");
      setLoading(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="p-6 border rounded-lg dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Repository Settings
      </h2>

      {!githubLinked ? (
        <div>
          <p className="text-gray-700 dark:text-gray-400 mb-3">
            Connect your GitHub account to manage repositories.
          </p>

          <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`}>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
              Connect GitHub Account
            </button>
          </a>
        </div>
      ) : connected ? (
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Connected Repo:</strong> {repo}
          </p>
          <button
            onClick={disconnectRepo}
            className="px-4 py-2 bg-gray-500 hover:bg-red-600 text-white rounded-md"
          >{loading ? "Disconnecting..." : "Disconnect Repository"}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 dark:text-gray-400 mb-3">
            Select a repository to connect for PR analysis.
          </p>
          {loaderVisible && <Loader />}
          {!loaderVisible && (
          <SelectInputs
            options={repos}
            value={selectedRepo}
            onChange={(v) => setSelectedRepo(v)}
            placeholder="Select repository"
          />)}

          <button
            onClick={connectRepo}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md mt-3"
          >{loading ? "Connecting..." : "Link Repository"}
          </button>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}
