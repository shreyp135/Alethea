"use client"
import React from "react";
import Home from "@/components/landing/home";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {

  // start as `undefined` (unknown) so we can distinguish
  // "not checked yet" from "checked and no token" (null)
  // const [token, setToken] = useState<string | null | undefined>(undefined);
  //   const router = useRouter();
  
  //   useEffect(() => {
  //     const t = localStorage.getItem("alethea_access");
  //     setToken(t);
  
  //     // redirect only after token is known
  //     if (t) {
  //       router.push("/dashboard");
  //     }
       
  //   }, [router]);
  
    // don't render layout until token check runs
    // (we only block render while token is `undefined`)
    // if (token === undefined) return null;
  

  
  return(<><div className="">
    <Home />
    </div></>) ;
}
