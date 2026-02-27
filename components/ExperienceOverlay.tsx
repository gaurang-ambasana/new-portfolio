"use client";

import { experiences as expData } from "./ExperienceNodes";
import { motion, AnimatePresence } from "framer-motion";

const detailedHighlights = [
  [
    "Led the end-to-end design and development of the GRAIXL Al Interview platform, translating the product vision into a scalable and robust production system.",
    "Architected and delivered full-stack features using a modern technology stack (React & Next.js, Node.js, MySQL), establishing a foundation for high-quality, maintainable code.",
    "Engineered the platform's core Al orchestration layer, integrating multiple LLMs (OpenAl, Deepseek-R1, Groq) and designing sophisticated prompt strategies to directly enhance evaluation accuracy.",
    "Built the real-time voice Al agent with Python and LiveKit, creating an intelligent routing system between providers (OpenAl Realtime, Deepgram, Eleven Labs) to optimise for latency, cost, and voice quality.",
    "Owned the complete voice interaction pipeline from speech capture to the generation of structured evaluation reports, forming the backbone of the platform's automated assessment functionality.",
  ],
  [
    "Led the decision-making and development of a large React application to Next.js, implementing server-side rendering to achieve a 30% improvement in page load speed, verified by Lighthouse.",
    "Oversaw the complete rebuild of a core product, transitioning it from a Google Sheets prototype to a fully integrated, native React application with a superior user experience.",
    "Developed and maintained backend services using Python (FastAPI, GraphQL) and Node.js, and implemented secure authentication with Google SSO and Auth0.",
    "Translated complex Figma designs into high-quality, responsive user interfaces using React, Next.js, and TypeScript (ensuring 100% product modules mobile responsiveness using pure CSS).",
    "Improved application state management by integrating Zustand and Redux, simplifying data flow and feature development for the entire team.",
    "Mentored teammates through code review and established coding standards to maintain a high-quality, consistent codebase.",
    "Took primary responsibility for resolving live production issues, ensuring system reliability and a positive user experience.",
    "Collaborated with product managers and designers to understand requirements and deliver complete features from initial concept to final deployment.",
  ],
  [
    "Ul development expert for the Google Cloud team, building and maintaining client-facing interfaces (including Add-ons) with React, JavaScript, and Node.js.",
    "Managed and optimised the data analytics pipeline, including writing and refining complex queries in BigQuery and automating data processes with shell scripts.",
    "Designed and built interactive business intelligence dashboards in Looker Studio, providing teams with real-time insights and supporting data-driven decisions.",
    "Automated repetitive workflows using Google Apps Script significantly reduce manual effort and improve operational efficiency.",
    "Developed internal tools that streamlined cross-team collaboration and increased overall productivity.",
    "Created an automated HR dashboard using Google APIs to manage employee onboarding and offboarding, simplifying asset tracking.",
  ],
  [
    "Promoted from Intern after four months based on strong performance and technical skills.",
    "Led the end-to-end development of automation tools, including a Mail Merge and Document Generator with Google Apps Script, significantly reducing time spent on routine tasks.",
    "Engineered a migration of financial models from Anaplan to Google Sheets, developing custom scripts for accurate and efficient financial forecasting.",
    "Built a complete insurance claim processing system on Google Cloud using Node.js and Apps Script, managing the project from initial concept to final deployment.",
    "Served as a primary developer for Google Workspace automation, working directly with clients to gather requirements, define project scope, and deliver solutions on tight deadlines.",
    "Acted as a key liaison between business units and technical teams, ensuring client feedback was captured and communicated to leadership to guide future improvements.",
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
              disabled={activeNode.index === 0}
              className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PREV
            </button>
            <button
              onClick={() => handleNav(1)}
              disabled={activeNode.index === expData.length - 1}
              className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            X
          </button>
        </div>
        <h2
          className="text-4xl font-bold tracking-tighter"
          style={{ color: exp.color }}
        >
          {exp.company}
        </h2>
        <p className="text-xl text-slate-200 font-medium mt-1">
          {exp.position}
        </p>
        <ul
          className="mt-8 space-y-6 flex-grow overflow-y-auto pr-4 custom-scrollbar"
          style={{ "--scrollbar-color": exp.color } as React.CSSProperties}
        >
          {exp.highlights.map((h, i) => (
            <li
              key={i}
              className="flex gap-4 text-slate-300 leading-relaxed text-[15px]"
            >
              <span
                className="mt-1 text-[10px]"
                style={{ color: exp.color }}
              >
                ▶
              </span>
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
