"use client"
import SignUpForm from "@/components/auth/SignUpForm";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";


export default function SignUp() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);
  }, []);

    if(token){
      router.push("/");
    }
  
  return <SignUpForm />;
}
