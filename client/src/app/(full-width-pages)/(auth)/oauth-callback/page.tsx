"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (!params) return;

    const access = params.get("access");

    if (access) {
      // save token
      localStorage.setItem("alethea_access", access);

      // redirect to dashboard/home
      router.replace("/");
    } else {
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
