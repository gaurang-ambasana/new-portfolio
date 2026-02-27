"use client";

import { useState } from "react";
import Scene from "@/components/Scene";

export default function Home() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className={`
          absolute z-10 pointer-events-none transition-all duration-500
          ${
            activeNode === null
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-3xl"
              : "top-10 left-10 max-w-2xl opacity-30"
          }
        `}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Gaurang Ambasana
        </h1>
        <p className="text-xl md:text-2xl text-indigo-400 mb-4 font-semibold">
          Senior Full Stack Engineer
        </p>
        <p className="text-sm md:text-md text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-lg backdrop-blur-sm border border-slate-800 shadow-lg">
          Specialising in building and scaling AI-integrated SaaS platforms.
          Click on any core below to expand my experience.
        </p>
      </div>

      {/* 3D canvas */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Scene activeNode={activeNode} setActiveNode={setActiveNode} />
      </div>
    </main>
  );
}
