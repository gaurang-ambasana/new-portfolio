"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Scene from "@/components/Scene";

const WORDS = [
  "Software Engineer",
  "Full Stack Developer",
  "Problem Solver",
  "Tech Enthusiast",
];

export default function Home() {
  const [activeNode, setActiveNode] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 40 : 100;
    const pauseTime = isDeleting ? 50 : 2000;

    const handleType = () => {
      const fullText = WORDS[titleIndex];

      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % WORDS.length);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex]);

  const handleActiveNodeChange = useCallback(
    (val: any) => setActiveNode(val),
    [],
  );

  const handleScrollChange = useCallback(
    (val: boolean) => setIsScrolled(val),
    [],
  );

  const name = "Gaurang Ambasana";

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-white font-sans">
      {/* Introduction Container */}
      <div
        className={`
        absolute z-10 pointer-events-none transition-all duration-1000 flex flex-col items-center justify-center w-full h-full
        ${activeNode !== null || isScrolled ? "opacity-0 -translate-y-20 scale-95" : "opacity-100"}
      `}
      >
        {/* Name: Staggered Typing Animation on First Render */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 flex">
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.1 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          {/* Cursor for the Name */}
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ repeat: 8, duration: 0.1, delay: 1.5 }} // Stops after name types
            className="w-[4px] h-[1em] bg-indigo-500 ml-1 mt-2"
          />
        </h1>

        {/* Continuous Typewriter Title */}
        <p className="text-xl md:text-3xl text-indigo-400 font-mono mb-8 h-10 flex items-center">
          {currentText}
          <span className="w-[3px] h-[0.8em] bg-slate-600 ml-2 animate-pulse" />
        </p>

        {/* Professional Tagline */}
        <p className="max-w-2xl mx-auto text-center text-slate-400 text-sm md:text-lg leading-relaxed px-6 py-8 border-t border-white/5 backdrop-blur-sm bg-slate-950/20 rounded-3xl">
          Senior Full Stack Engineer with{" "}
          <span className="text-white font-bold">5+ years of experience</span>{" "}
          in the software industry.
          <br className="hidden md:block" />
          Specializing in building and scaling AI-integrated SaaS platforms.
          <span className="text-[10px] uppercase tracking-[0.5em] text-slate-600 mt-8 block animate-bounce">
            Scroll to explore timeline
          </span>
        </p>
      </div>

      {/* Instructional Title on Scroll */}
      <div
        className={`
        absolute top-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none transition-all duration-700
        ${isScrolled && activeNode === null ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
      `}
      >
        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-indigo-500 font-bold mb-2">
          Professional History
        </h3>
        <p className="text-lg md:text-xl font-medium text-slate-200 tracking-tight">
          Select a{" "}
          <span className="text-white border-b border-indigo-500/50 italic">
            Neural Core
          </span>{" "}
          to view impact
        </p>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Scene
          activeNode={activeNode}
          setActiveNode={handleActiveNodeChange}
          onScrollChange={handleScrollChange}
        />
      </div>
    </main>
  );
}
