"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";


import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (!params) return;

    const access = params.get("access");
    const github = params.get("github");

    if (access) {
      // save token
      localStorage.setItem("alethea_access", access);
      if (github) {
      localStorage.setItem("alethea_github", github);
      }

      // redirect to dashboard/home
      router.replace("/dashboard");
    } else {``
      // redirect to signin page
      router.replace("/signin?error=oauth");
    }
  }, [params, router]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-lg">
      Signing you in...
    </div>
  );
}
