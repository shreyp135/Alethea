"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const steps = [
  "Initializing runtime",
  "Waking backend server",
  "Connecting database",
  "Connecting Redis",
  "Loading AI services",
];

export default function BootLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Skip if already booted during this tab session
    if (sessionStorage.getItem("backend-ready")) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const animate = setInterval(() => {
      setCurrentStep((prev) =>
        prev < steps.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    const boot = async () => {
      let retries = 0;

      while (!cancelled) {
        try {
          const res = await fetch(`${API_URL}/health`, {
            cache: "no-store",
          });

          if (res.ok) {
            sessionStorage.setItem("backend-ready", "true");

            clearInterval(animate);

            setCurrentStep(steps.length);

            setTimeout(() => {
              setReady(true);
            }, 500);

            return;
          }
        } catch {}

        retries++;

        if (retries >= 20) {
          clearInterval(animate);
          setFailed(true);
          return;
        }

        await new Promise((r) => setTimeout(r, 3000));
      }
    };

    boot();

    return () => {
      cancelled = true;
      clearInterval(animate);
    };
  }, []);

  if (ready) return <>{children}</>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">

        {/* Header */}
        <div className="border-b border-zinc-800 px-6 py-4">
          <h1 className="text-2xl font-bold tracking-[0.35em] text-cyan-400">
            ALETHEA
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Initializing workspace...
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-4"
            >
              {index < currentStep ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold">
                  ✓
                </div>
              ) : index === currentStep && !failed ? (
                <div className="h-5 w-5 rounded-full border-2 border-zinc-700 border-t-cyan-400 animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-zinc-700" />
              )}

              <span
                className={`${
                  index <= currentStep
                    ? "text-zinc-100"
                    : "text-zinc-500"
                }`}
              >
                {step}
              </span>
            </div>
          ))}

          {/* Progress Bar */}
          {!failed && (
            <>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{
                    width: `${(currentStep / steps.length) * 100}%`,
                  }}
                />
              </div>

              <p className="text-sm text-zinc-500">
                Cold starting backend (wait time: 30s)...
              </p>
            </>
          )}

          {/* Error */}
          {failed && (
            <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-5">
              <h2 className="font-semibold text-red-400">
                Unable to reach backend
              </h2>

              <p className="mt-2 text-sm text-zinc-300">
                The backend could not be started.
              </p>

              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                <li>Google Cloud service is not starting</li>
                <li>Google Cloud billing issue</li>
                <li>Temporary infrastructure outage</li>
              </ul>

              <button
                onClick={() => location.reload()}
                className="mt-6 rounded-lg bg-cyan-500 px-5 py-2 font-medium text-black transition hover:bg-cyan-400"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
