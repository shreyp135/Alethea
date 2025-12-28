"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ComponentCard from "@/components/common/ComponentCard";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function Page() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [textData, setTextData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [story, setStory] = useState<string>("");
  const [anomalies, setAnomalies] = useState<any[]>([]);

function convertIncidentToHTML(text: string) {
  // Step 1 — Convert markdown bold to HTML <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, "<br/><strong>$1</strong><br/>");

  // Step 2 — Convert remaining newlines to <br/>
  text = text.replace(/\n/g, "<br/>");

  // Wrap whole thing
  return `<div class="incident-report">${text}</div>`;
}


  // Authentication check
  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);

    if (!t) {
      router.replace("/signin?error=auth");
    }
  }, [router]);

  // Loading state before auth check completes
  if (token === null) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Checking authentication...
      </div>
    );
  }

  // Submit handler
  const handleSubmit = async () => {
    setIsLoading(true);
    setEvents([]);
    setAnomalies([]);
    setStory("");
    setIsResponse(false);

    if (!textData && files.length === 0) {
      toast.error("Please provide log data via text or file upload.");
      setIsLoading(false);
      return;
    }
    const auth = localStorage.getItem("alethea_access");
    toast.loading("Please wait for a while we analyze the logs...", { duration: 7000 });

    try {
      let logsPayload = textData.trim();

      if (!logsPayload && files.length > 0) {
        const fileContents = await Promise.all(files.map((f) => f.text()));
        logsPayload = fileContents.join("\n");
      }

      if (!logsPayload) {
        console.warn("No input provided");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs/ingest`,
        { logs: logsPayload },
        { headers: { Authorization: auth || "" } }
      );
      console.log("Log analysis response:", response.data);
      const { events, anomalies, story } = response.data;
      setEvents(events);
      setAnomalies(anomalies);
      const formattedStory = convertIncidentToHTML(story);
      setStory(formattedStory);
      setIsResponse(true);
    } catch (err) {
      console.error("Log analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" p-4 md:p-6" >
      {isResponse ? (
        <ComponentCard title="Analysis Results">
           {story ? ( <>  
           <div>
              <h3 className="text-lg font-medium dark:text-white">Generated Story</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: story }}
                  className="mb-4 text-gray-700 dark:text-gray-300"
                />
            </div>         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ul className="space-y-2">
                <h3 className="text-lg font-medium mb-3 dark:text-white">Detected Events</h3>

              {events.map((item: any, index: number) => (
                <li key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <pre className="text-sm text-gray-900 dark:text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
            
            <ul className="space-y-2">
                <h3 className="text-lg font-medium mb-3 dark:text-white">Detected Anomalies</h3>

              {anomalies.map((item: any, index: number) => (
                <li key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <pre className="text-sm text-gray-900 dark:text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>

          </div>         

            </>

          ) : (
            <p className="text-gray-600 dark:text-gray-400">No events detected.</p>
          )}

        </ComponentCard>
      ) : (
        <div>
          <ComponentCard title="Upload Log Files or Paste Log Data">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DropzoneComponent onChange={setFiles} />
              <TextAreaInput value={textData} onChange={setTextData} />
            </div>

            <p className="text-gray-400 text-sm mt-2">
              * If both log file(s) and raw log data are provided, raw text will be prioritized.<br/>
              *This data is not saved with us due to privacy reasons, on refreshing the page it will be lost.
            </p>
          </ComponentCard>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#145FC0] text-white px-4 py-2 rounded-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "Analyze Logs"}
            </button>
          </div>
        </div>
      )}
      <Toaster position="bottom-right" reverseOrder={false} />

    </div>
  );
}
