"use client"

import SignInForm from "@/components/auth/SignInForm";
import { useRouter } from "next/navigation";
import { useState,useEffect, Suspense } from "react";

export default function SignIn() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);
  }, []);

  if(token){
    router.push("/");
  }
    return (
      <Suspense fallback={<div>Loading...</div>}
      >
        <SignInForm />
      </Suspense>
    )
}
