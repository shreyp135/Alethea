"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const access = params.get("access");
    if (access) {
      localStorage.setItem("alethea_access", access);
      router.push("/");
    } else {
      router.push("/login?error=oauth");
    }
  }, [params, router]);

  return <div>Signing you in...</div>;
}
