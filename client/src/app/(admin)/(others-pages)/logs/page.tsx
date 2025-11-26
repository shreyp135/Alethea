"use client";
import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ComponentCard from "@/components/common/ComponentCard";
import { Toaster } from "react-hot-toast";
import axios from "axios";

export default function page() {
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [textData, setTextData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [PR, setPR] = useState<[]>([]);
  const [isresponse, setIsresponse] = useState<boolean>(false);
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
  
  const handlesubmit = async () => {
    setIsLoading(true);
    setPR([] );
    setIsresponse(false);
    // If both provided, raw log data prioritized
    if (textData && textData.trim().length > 0) {
      console.log("Submitting raw log data for analysis", textData);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logs/ingest`, { logs: textData });
      setPR(response.data);
      setIsresponse(true);
      setIsLoading(false);
      return;
    }

    if (files.length > 0) {
      // read files
      const contents = await Promise.all(files.map((f) => f.text()));
      const combinedLogs = contents.join("\n");

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logs/ingest`, { logs: combinedLogs });
      setPR(response.data);
      setIsresponse(true);
      setIsLoading(false);
      return;
    }

    // nothing provided
    console.warn("No input provided for analysis");
    setIsLoading(false);
  };

  return (
    <div className="mt-8">

      {isresponse && (<>
      <div>
        <ComponentCard title="Analysis Results">
          <div className="">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Detected Events:</h3>
            {PR && PR.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {PR.map((item, index) => (
                  <li key={index} className="text-gray-800 dark:text-gray-200">
                    {JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No events detected.</p>
            )}
          </div>
        </ComponentCard>
      </div>
        
      </>)}
      {!isresponse &&(
      <div>
        <ComponentCard title="Upload Log Files or Paste Log Data">

      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        <DropzoneComponent onChange={(f) => setFiles(f)} />
        <TextAreaInput value={textData} onChange={(v) => setTextData(v)} />
    </div>
    <div className="text-gray-400 text-sm">
      * If both log file(s) and log data are provided, raw log data will be prioritized for analysis.
    </div>
      </ComponentCard>
      <div className="mt-4 flex justify-center ">
        <button onClick={handlesubmit} className="bg-[#145FC0] text-white dark:bg-gray-800 dark:text-white rounded-md px-4 py-2 hover:shadow-lg transition-400 mt-4">
          {isLoading ? "Analyzing..." : "Analyze Logs"}
        </button>
      </div>
      </div>
      )}
    </div>
  );
}
