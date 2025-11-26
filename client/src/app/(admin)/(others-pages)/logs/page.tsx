"use client";
import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ComponentCard from "@/components/common/ComponentCard";
import { Toaster } from "react-hot-toast";

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
  
  const handlesubmit=()=>{  }

  return (
    <div className="mt-8">
      <ComponentCard title="Upload Log Files or Paste Log Data">
      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        <DropzoneComponent />
        <TextAreaInput />
    </div>
    <div className="text-gray-400 text-sm">
      * If both log file(s) and log data are provided, raw log data will be prioritized for analysis.
    </div>
      </ComponentCard>
      <div className="mt-4 flex justify-center ">
        <button onClick={handlesubmit} className="bg-[#145FC0] text-white dark:bg-gray-800 dark:text-white rounded-md px-4 py-2 hover:shadow-lg transition-400 mt-4">Analyze Logs</button>
      </div>
      <Toaster />
    </div>
  );
}
