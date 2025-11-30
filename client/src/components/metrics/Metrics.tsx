"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const Metrics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row justify-center py-10 items-center gap-24 rounded-2xl border border-gray-200 bg-white px-7 dark:border-gray-800 dark:bg-white/[0.03] md:px-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex  items-center justify-center w-20 h-20 bg-gray-100 rounded-xl dark:bg-gray-800">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#6b7280" fill-rule="evenodd" d="M7 8.83a3.001 3.001 0 1 0-2 0v6.34a3.001 3.001 0 1 0 2 0zM6 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2m0 12a1 1 0 1 0 0 2a1 1 0 0 0 0-2m11-1.83a3.001 3.001 0 1 0 2 0V10.4A5.4 5.4 0 0 0 13.6 5h-.186l.293-.293a1 1 0 0 0-1.414-1.414l-2 2a1 1 0 0 0 0 1.414l2 2a1 1 0 1 0 1.414-1.414L13.414 7h.186a3.4 3.4 0 0 1 3.4 3.4zM17 18a1 1 0 1 1 2 0a1 1 0 0 1-2 0" clip-rule="evenodd"/></svg>      
  </div>

        <div className="flex items-center justify-between ">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg text-gray-500 dark:text-gray-400">
              Pull Requests
            </div>
            <div className="mt-2 ml-1 font-bold text-[#145FC0] text-title-sm dark:text-white/90">
              3,782
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row justify-center items-center gap-24 rounded-2xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex  items-center justify-center w-20 h-20 bg-gray-100 rounded-xl dark:bg-gray-800">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#6b7280" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M12 16h.008M12 10v3m-1.425-7.783L3.517 17a1.667 1.667 0 0 0 1.425 2.5h14.116a1.666 1.666 0 0 0 1.425-2.5L13.426 5.217a1.666 1.666 0 0 0-2.85 0"/></svg>   </div>

        <div className="flex items-center justify-between ">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg text-gray-500 dark:text-gray-400">
              Anomalies
            </div>
            <div className="mt-2 ml-1 font-bold text-[#145FC0] text-title-sm dark:text-white/90">
              3,782
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row justify-center items-center gap-24 rounded-2xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex  items-center justify-center w-20 h-20 bg-gray-100 rounded-xl dark:bg-gray-800">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#6b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h1m-1 7h1m-1 7h1M8 5h1m-1 7h1m-1 7h1m4-14h8m-8 7h8m-8 7h8"/></svg>      </div>

        <div className="flex items-center justify-between ">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg text-gray-500 dark:text-gray-400">
              Logs 
            </div>
            <div className="mt-2 ml-1 font-bold text-[#145FC0] text-title-sm dark:text-white/90">
              3,782
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}



    </div>
  );
};
