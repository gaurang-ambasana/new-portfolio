"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Scene from "@/components/Scene";
import CustomCursor from "@/components/CustomCursor";

const WORDS = [
  "Software Engineer",
  "Full Stack Developer",
  "Problem Solver",
  "Tech Enthusiast",
];

function ContactIcon({
  type,
}: {
  type: "email" | "github" | "mobile" | "linkedin";
}) {
  if (type === "email") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 6.75h18v10.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25V6.75Z" />
        <path d="m4.5 8.25 7.01 5.26a.84.84 0 0 0 .98 0L19.5 8.25" />
      </svg>
    );
  }

  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.93.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.11 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.32.1-2.75 0 0 .85-.28 2.79 1.06A9.4 9.4 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.93-1.34 2.78-1.06 2.78-1.06.55 1.43.2 2.49.1 2.75.64.72 1.03 1.64 1.03 2.77 0 3.97-2.35 4.84-4.59 5.09.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.29 10.29 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }

  if (type === "mobile") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="7" y="2.75" width="10" height="18.5" rx="2.25" />
        <path d="M10.5 5.75h3" />
        <circle cx="12" cy="17.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M6.94 8.5A1.56 1.56 0 1 1 6.93 5.4 1.56 1.56 0 0 1 6.94 8.5ZM8.3 9.69v8.9H5.58v-8.9H8.3ZM12.6 9.69v1.21h.04c.38-.73 1.31-1.5 2.7-1.5 2.9 0 3.43 1.9 3.43 4.37v4.82h-2.72v-4.27c0-1.02-.02-2.33-1.42-2.33-1.42 0-1.64 1.11-1.64 2.26v4.34h-2.72v-8.9h2.33ZM20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function ContactItem({
  href,
  label,
  value,
  type,
  tones,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  type: "email" | "github" | "mobile" | "linkedin";
  tones: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`rounded-[24px] border p-5 transition ${tones}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white">
          <ContactIcon type={type} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.28em]">{label}</p>
          <p className="mt-3 text-lg font-medium text-white break-all">
            {value}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [activeNode, setActiveNode] = useState(null);

  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    isPastExperience: false,
    isPastProjects: false,
  });

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
    (state: {
      isScrolled: boolean;
      isPastExperience: boolean;
      isPastProjects: boolean;
    }) => setScrollState(state),
    [],
  );

  const name = "Gaurang Ambasana";

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-white font-sans">
      <CustomCursor />
      <div
        className={`
        absolute z-10 pointer-events-none transition-all duration-1000 flex flex-col items-center justify-center w-full h-full
        ${activeNode !== null || scrollState.isScrolled ? "opacity-0 -translate-y-20 scale-95" : "opacity-100"}
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
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ repeat: 8, duration: 0.1, delay: 1.5 }}
            className="w-[4px] h-[1em] bg-indigo-500 ml-1 mt-2"
          />
        </h1>

        <p className="text-xl md:text-3xl text-indigo-400 font-mono mb-8 h-10 flex items-center">
          {currentText}
          <span className="w-[3px] h-[0.8em] bg-slate-600 ml-2 animate-pulse" />
        </p>
        <p className="max-w-2xl mx-auto text-center text-slate-400 text-sm md:text-lg leading-relaxed px-6 py-8 border-t border-white/5 backdrop-blur-sm bg-slate-950/20 rounded-3xl">
          Full Stack Engineer with{" "}
          <span className="text-white font-bold">5+ years of experience</span>{" "}
          in the software industry.
          <br className="hidden md:block" />
          Specializing in building and scaling AI-integrated Web Applications &
          SaaS platforms.
          <span className="text-sm uppercase tracking-[0.5em] text-slate-600 mt-8 block animate-bounce font-bold">
            Scroll to explore professional journey
          </span>
        </p>
      </div>

      {/* 2. Professional History HUD: Visible only in the Experience Zone */}
      <div
        className={`
        absolute top-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none transition-all duration-700
        ${
          scrollState.isScrolled &&
          !scrollState.isPastExperience &&
          activeNode === null
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10"
        }
      `}
      >
        <h3 className="text-[14px] font-mono uppercase tracking-[0.4em] text-indigo-500 font-bold mb-2">
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

      {/* 3. Featured Projects HUD: Visible only in the Projects Zone */}
      <div
        className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none transition-all duration-700
          ${
            scrollState.isPastExperience &&
            !scrollState.isPastProjects &&
            activeNode === null
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }
        `}
      >
        <h3 className="text-[14px] font-mono uppercase tracking-[0.4em] text-emerald-500 font-bold mb-2">
          Featured Projects
        </h3>
        <p className="text-lg md:text-xl font-medium text-slate-200 tracking-tight">
          Showcasing{" "}
          <span className="text-white border-b border-emerald-500/50 italic">
            Technical Innovation
          </span>
        </p>
      </div>

      <div
        className={`
          pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6 transition-all duration-700
          ${
            scrollState.isPastProjects && activeNode === null
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-12 scale-95"
          }
        `}
      >
        <div className="pointer-events-auto mx-auto w-full max-w-5xl rounded-[32px] border border-cyan-400/15 bg-slate-950/72 p-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.42em] text-cyan-300">
                Contact Node
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Building reliable product experiences with strong full stack
                execution.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                My work focuses on thoughtful interfaces, scalable application
                architecture, and AI-driven product experiences that feel clear
                in use and dependable in production. If you&apos;re building
                something ambitious and want an engineer who can carry ideas
                from concept through delivery, I&apos;d be glad to connect.
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Open to collaborations
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Full stack systems
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  AI product engineering
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <ContactItem
                href="mailto:gpambasana@gamil.com"
                label="Email"
                value="gpambasana@gamil.com"
                type="email"
                tones="border-sky-400/15 bg-sky-400/8 text-sky-300 hover:border-sky-300/30 hover:bg-sky-400/12"
              />
              <ContactItem
                href="https://github.com/gaurang-ambasana"
                label="GitHub"
                value="github.com/gaurang-ambasana"
                type="github"
                tones="border-violet-400/15 bg-violet-400/8 text-violet-300 hover:border-violet-300/30 hover:bg-violet-400/12"
                external
              />
              <ContactItem
                href="tel:+919033835053"
                label="Mobile"
                value="+91-9033835053"
                type="mobile"
                tones="border-emerald-400/15 bg-emerald-400/8 text-emerald-300 hover:border-emerald-300/30 hover:bg-emerald-400/12"
              />
              <ContactItem
                href="https://www.linkedin.com/in/gpambasana"
                label="LinkedIn"
                value="linkedin.com/in/gpambasana"
                type="linkedin"
                tones="border-cyan-400/15 bg-cyan-400/8 text-cyan-300 hover:border-cyan-300/30 hover:bg-cyan-400/12"
                external
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene Container */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Scene
          activeNode={activeNode}
          setActiveNode={handleActiveNodeChange}
          onScrollChange={handleScrollChange}
        />
      </div>
    </main>
  );
}
