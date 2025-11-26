"use client";
import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
    const [token, setToken] = useState<string | null>(null);
    const [isLinked, setIsLinked] = useState<boolean>(false);


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
  
  useEffect(() => {
    const checkGithubLinked = async () => {
      const linked = localStorage.getItem("github_linked");
      if (linked === "true") {
        setIsLinked(true);
        return;
      }
      if (linked === null) {
        if (!token) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/link`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        localStorage.setItem("github_linked", data.linked.toString());
        setIsLinked(data.linked);
        return;
      }
    };

    checkGithubLinked();
  }, [token]);

  return (
    <div>
        
    </div>
  );
}
