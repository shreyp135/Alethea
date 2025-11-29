"use client";
import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import PRConnectPanel from "@/components/pr/PRConnectPanel";
import PRList from "@/components/pr/PRList";
import PRInstructions from "@/components/pr/PRInstructions";

export default function page() {
    const [token, setToken] = useState<string | null>(null);


  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);

    // redirect only after token is known
    if (!t) {
      router.push("/signin?error=auth");
    }
  }, [router]);

  // don't render layout until token check runs
  if (token === null) return null;
  
  // useEffect(() => {
  //   const checkGithubLinked = async () => {
  //     const linked = localStorage.getItem("github_linked");
  //     if (linked === "true") {
  //       setIsLinked(true);
  //       return;
  //     }
  //     if (linked === null) {
  //       if (!token) return;
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/link`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const data = await response.json();
  //       localStorage.setItem("github_linked", data.linked.toString());
  //       setIsLinked(data.linked);
  //       return;
  //     }
  //   };

  //   checkGithubLinked();
  // }, [token]);

  return (
    <div className="p-8 w-full min-h-screen ">
      {/* <h1 className="text-3xl font-semibold mb-6">PR Analyzer</h1> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: repo connect / disconnect */}
        <div className="lg:col-span-1">
          <PRConnectPanel />
        </div>

        {/* Right side: list of PRs or placeholder */}
        <div className="lg:col-span-2">
          <PRList />
        </div>
      </div>

      {/* Always show instructions */}
      <div className="mt-10">
        <PRInstructions />
      </div>
    </div>
  );
}