"use client"
import React from "react";
import Home from "@/components/landing/home";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {

    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
  
    useEffect(() => {
      const t = localStorage.getItem("alethea_access");
      setToken(t);
  
      // redirect only after token is known
      if (t) {
        router.push("/dashboard");
      }
       
    }, [router]);
  
    // don't render layout until token check runs
    if (token === null) return null;
  

  
  return(<><div className="">
    <Home />
    </div></>) ;
}
