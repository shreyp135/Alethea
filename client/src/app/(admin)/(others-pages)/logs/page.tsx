"use client";
import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

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
  

  return (
    <div>
        logs
    </div>
  );
}
