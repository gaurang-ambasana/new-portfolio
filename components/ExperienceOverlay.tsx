"use client";

import { experiences as expData } from "./ExperienceNodes";
import { motion, AnimatePresence } from "framer-motion";

const detailedHighlights = [
  [
    "End-to-end design of AI Interview platform.",
    "Engineered core AI orchestration with OpenAI, Deepseek-R1, and Groq.",
    "Built real-time voice AI agent with Python and LiveKit.",
  ],
  [
    "Led React to Next.js migration, 30% speed gain.",
    "Rebuilt core product from Google Sheets to native React.",
    "Managed backends with FastAPI and Node.js.",
  ],
  [
    "Expert UI dev for Google Cloud team.",
    "Optimized BigQuery analytics pipelines.",
    "Designed BI dashboards in Looker Studio.",
  ],
  [
    "Built automation tools with Google Apps Script.",
    "Engineered financial model migration (Anaplan to Sheets).",
    "Developed cloud insurance claim system.",
  ],
];

export default function ExperienceOverlay({ activeNode, setActiveNode }: any) {
  if (!activeNode) return null;
  const exp = {
    ...expData[activeNode.index],
    highlights: detailedHighlights[activeNode.index],
  };

  const handleNav = (dir: number) => {
    const next = (activeNode.index + dir + expData.length) % expData.length;
    setActiveNode({ index: next, x: activeNode.x, y: activeNode.y });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setActiveNode(null)}
        className="fixed inset-0 z-[90] bg-slate-950/20 backdrop-blur-[2px]"
      />
      <motion.div
        key={activeNode.index}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed top-10 right-10 z-[100] w-[400px] h-[85vh] bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl"
        style={{ borderLeft: `6px solid ${exp.color}` }}
      >
        <div className="flex justify-between mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => handleNav(-1)}
              className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all"
            >
              PREV
            </button>
            <button
              onClick={() => handleNav(1)}
              className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all"
            >
              NEXT
            </button>
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <h2
          className="text-4xl font-bold tracking-tighter"
          style={{ color: exp.color }}
        >
          {exp.company}
        </h2>
        <p className="text-xl text-slate-200 font-medium mt-1">
          Full Stack Developer
        </p>
        <ul className="mt-8 space-y-6 flex-grow overflow-y-auto pr-4 custom-scrollbar">
          {exp.highlights.map((h, i) => (
            <li
              key={i}
              className="flex gap-4 text-slate-300 leading-relaxed text-[15px]"
            >
              <span className="text-indigo-500 mt-2 text-[10px]">▶</span>
              {h}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setActiveNode(null)}
          className="mt-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all text-white font-bold text-xs uppercase tracking-widest"
        >
          Close
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
