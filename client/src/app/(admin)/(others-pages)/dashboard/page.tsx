"use client";

import Dashboard from "@/components/landing/dashboard";
import React from "react";
import { useState,useEffect } from "react";


export default function DashboardPage() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);
  }, []);
  

  return (
    <div className="p-4 md:p-6">
      <Dashboard />
    </div>
  );
}
