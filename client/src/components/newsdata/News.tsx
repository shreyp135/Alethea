"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
import Loader from "../ui/loader/Loader";

interface NewsItem {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  pubDate: string;
  image_url?: string;
  source_name?: string;
  category?: string[];
}

export default function OutageNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutageNews = async () => {
      setLoading(true);

      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

        // Fetch ONLY outage-related tech news
        const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&qInTitle=outage&language=en&category=technology&removeduplicate=1&sort=relevancy`;

        const res = await axios.get(url);
        setNews(res.data.results || []);
        const fivenews = (res.data.results || []).slice(0, 4);
        setNews(fivenews);
      } catch (err) {
        console.error("Failed to fetch outage news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutageNews();
    
  }, []);
  let loadingMessage;
  if (loading) 
    loadingMessage =<div className="ml-12"> <Loader /></div>;
  let noNewsMessage;
  if (news.length === 0)
    noNewsMessage = <div className="dark:text-white p-6">No relevant news found.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-normal ml-2 dark:text-white/90">Recent Tech Outage News</h2>
      {loadingMessage}
      {!loading && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell> */}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Source
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {news.map((order) => (
                <TableRow key={order.article_id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex gap-3">
                      {/* <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src={order.image_url || "/default-news.png"}
                          alt={"news image"}
                              className="w-full h-full object-cover object-center"

                        /> */}
                    <div className="w-10 h-10 relative flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src={order.image_url ?? "/default-news.png"}
                            alt={order.title ?? "news image"}
                            fill
                            className="object-cover object-center"
                            sizes="40px"
                            unoptimized
                        />
                    </div>

                      <a href={order.link}>
                      <div className="align-middle font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                          {order.title}
                      </div>
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.description || "No description available."}
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={teamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Active"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.source_name || "Sourced externally"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                  {!loading && noNewsMessage}
        </div>

      </div>
      
    </div>
    )}

      {news.map((item) => (<></>
        // <div
        //   key={item.article_id}
        //   className="border p-4 rounded-md shadow-sm flex gap-4"
        // >
        //   {/* Image */}
        //   {item.image_url && (
        //     <img
        //       src={item.image_url}
        //       alt="news thumbnail"
        //       className="w-32 h-20 object-cover rounded"
        //     />
        //   )}

        //   <div className="flex flex-col">
        //     {/* Title */}
        //     <a
        //       href={item.link}
        //       target="_blank"
        //       rel="noopener noreferrer"
        //       className="text-lg font-bold text-blue-600"
        //     >
        //       {item.title}
        //     </a>

        //     {/* Description */}
        //     <p className="text-gray-700 text-sm mt-1">
        //       {item.description || "No description available."}
        //     </p>

        //     {/* Metadata */}
        //     <p className="text-xs text-gray-500 mt-2">
        //       {item.source_name ? `${item.source_name} • ` : ""}
        //       {new Date(item.pubDate).toLocaleString()}
        //     </p>
        //   </div>
        // </div>
      ))}

    </div>
  );
}
