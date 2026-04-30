"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import YouTubeEmbed from "../ui/video/YouTubeEmbed";


export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);

  }, []);

  async function handlelogout() {
    localStorage.removeItem("alethea_access");
    localStorage.removeItem("alethea_github");
    localStorage.removeItem("alethea_github_repo");
    setToken(null);
  }



  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#031226] to-[#071a33] text-white relative overflow-hidden">

      {/* Blue Glow Arc (right side) - decorative */}
      <div
        className="absolute right-0 top-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl opacity-40 pointer-events-none z-0"
        aria-hidden
      />

      {/* Star Grid (decorative) */}
      <div
        className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-cover pointer-events-none z-0"
        aria-hidden
      />

      {/* Floating Stars (decorative) */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* NAVBAR - make sure it's above decorative layers */}
      <header className="w-full flex justify-between items-center px-8 py-6 relative z-20">
        <a href="/">
          <div className="flex items-center gap-3">
            <Image src="/images/logo/alethea-logo-icon.png" alt="logo" width={55} height={55} />
            <span className="font-semibold text-xl tracking-widest">ALETHEA</span>
          </div>
        </a>
        <a href="/signin">
          <div onClick={handlelogout} className="flex items-center gap-5">
            {/* <button className="text-gray-300 hover:text-white cursor-pointer">Log in</button> */}

            <button className="text-md tracking-wide mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-blue-200 text-black shadow-lg hover:opacity-90 transition cursor-pointer">
              {token ? "Logout" : "Login"}

            </button>
          </div>
        </a>
      </header>

      {/* HERO SECTION - ensure it sits above background */}
      <section className="w-full flex flex-col items-center text-center px-6 mt-18 relative z-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl">
          Every bug has a story.
          <br />
          Alethea tells it.
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl">
          Transform raw logs into clear, human-readable insights and <br />
          catch risks instantly.
          Spot dangerous PRs before they ever reach production.
          <br />
          Chat with Alethea to explore past incidents and prevent future failures.  </p>

        <div className="flex gap-8">
          <div>
            {/* CTA Button */}
            <a href={token ? "/dashboard" : "/signin"}>
              <button
                className="mt-8 px-8 py-3 rounded-full bg-linear-to-r from-blue-400 to-blue-600 shadow-lg hover:opacity-80 hover:shadow-2xl transition text-white font-medium cursor-pointer relative z-30"
                onClick={() => console.log("CTA clicked")}
              >
                {token ? "Go to Dashboard" : "Get Started"}
              </button>
            </a>
          </div>
          <div>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              className="p-6 w-[95vw] max-w-5xl"
            >
              <div className="w-full aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/9b08xv018Y4"
                  title="Demo Video"
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Modal>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-8 py-3 rounded-full bg-linear-to-r from-teal-700 to-teal-500 shadow-lg hover:opacity-80 hover:shadow-2xl transition text-white font-medium cursor-pointer relative z-30"
            >
              See Demo Video
            </button>
          </div>
        </div>



        {/* TRUSTED BY */}
        <p className="mt-36 text-gray-400">© Alethea 2025</p>
      </section>
    </div>
  );
}
