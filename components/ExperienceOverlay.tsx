"use client";

import { experiences } from "./ExperienceNodes";

export default function ExperienceOverlay({
  activeNode,
  setActiveNode,
}: {
  activeNode: number | null;
  setActiveNode: (index: number | null) => void;
}) {
  if (activeNode === null) return null;

  const exp = experiences[activeNode];
  return (
    <div className="absolute bottom-10 right-10 z-20 max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-6 text-white shadow-2xl">
      <h2 className="text-2xl font-bold" style={{ color: exp.color }}>
        {exp.company}
      </h2>
      <p className="text-lg text-slate-300">{exp.role}</p>
      <p className="text-sm text-slate-400 mb-4">{exp.date}</p>
      <ul className="list-disc list-inside space-y-2 text-slate-200">
        {exp.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <button
        onClick={() => setActiveNode(null)}
        className="absolute top-2 right-2 text-slate-400 hover:text-white text-xl"
      >
        ✕
      </button>
    </div>
  );
}
