"use client"
import React from "react";
import News from "../newsdata/News";
import ComponentCard from "../common/ComponentCard";
import { Metrics } from "../metrics/Metrics";

export default function Dashboard() {
  
  return(<><div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Metrics  />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-12">
            <News />

    </div>
    </div></>) ;
}
