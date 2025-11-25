"use client"
import React from "react";
import Image from "next/image";

export default function Home() {
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#031226] to-[#071a33] text-white relative overflow-hidden ">

      {/* Blue Glow Arc (right side) */}
      <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl opacity-40 pointer-events-none" />

      {/* Star Grid */}
      <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-cover " />

      {/* Floating Stars */}
      <div className="absolute inset-0 ">
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

      {/* NAVBAR */}
      <header className="w-full flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <Image src="/images/logo/alethea-logo-icon.png" alt="logo" width={38} height={38} />
          <span className="font-semibold text-xl tracking-widest">ALETHEA</span>
        </div>

        {/* <nav className="hidden md:flex items-center gap-8 text-gray-300">
          <span className="cursor-pointer hover:text-white">Products</span>
          <span className="cursor-pointer hover:text-white">Resources</span>
          <span className="cursor-pointer hover:text-white">Pricing</span>
          <span className="cursor-pointer hover:text-white">Blog</span>
        </nav> */}

        <div className="flex items-center gap-5">
          <button className="text-gray-300 hover:text-white">Log in</button>

          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg hover:opacity-90 transition">
            Try For Free
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center text-center px-6 mt-20">
        {/* New Feature Pill */}
        {/* <div className="mb-6">
          <button className="px-5 py-[6px] rounded-full bg-blue-800/40 text-blue-300 border border-blue-700 flex items-center gap-2 text-sm">
            New feature
            <span className="text-white/90">Check out the team dashboard →</span>
          </button>
        </div> */}

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl">
          High-performing remote teams.
          <br />
          The future of work.
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl">
          Powerful, self-serve team engagement tools and analytics. Supercharge
          your managers & keep employees engaged from anywhere.
        </p>

        {/* CTA Button */}
        <button className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:opacity-90 transition text-white font-medium">
          Try For Free
        </button>

        {/* TRUSTED BY */}
        <p className="mt-32 text-gray-400">© Alethea 2025</p>

        {/* <div className="flex flex-wrap justify-center gap-10 mt-6 opacity-80">
          <span className="text-lg">Boltshift</span>
          <span className="text-lg">Lightbox</span>
          <span className="text-lg">FeatherDev</span>
          <span className="text-lg">GlobalBank</span>
        </div> */}
      </section>

    </div>
  );
}
