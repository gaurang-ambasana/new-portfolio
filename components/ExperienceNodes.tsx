"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

export const experiences = [
  {
    company: "GRAIXL OÜ",
    role: "Full Stack Developer",
    date: "July 2025 - Present",
    color: "#6366f1",
    highlights: [
      "Engineered AI orchestration layer with OpenAI, Deepseek-R1, and Groq.",
      "Built real-time voice AI agent with Python and LiveKit.",
    ],
    position: [-4.5, 0, 0] as [number, number, number],
  },
  {
    company: "Tailorbird Inc",
    role: "Software Engineer",
    date: "Feb 2023 - June 2025",
    color: "#14b8a6",
    highlights: [
      "Led React to Next.js migration, achieving 30% page load speed improvement.",
      "Developed backend services using Python (FastAPI, GraphQL) and Node.js.",
    ],
    position: [-1.5, 0, 0] as [number, number, number],
  },
  {
    company: "Wipro",
    role: "Software Engineer",
    date: "Nov 2021 - Feb 2023",
    color: "#f59e0b",
    highlights: [
      "Managed and optimized the data analytics pipeline using BigQuery.",
      "Designed business intelligence dashboards in Looker Studio.",
    ],
    position: [1.5, 0, 0] as [number, number, number],
  },
  {
    company: "Searce Inc",
    role: "Intern + Analyst",
    date: "Apr 2020 - Nov 2021",
    color: "#ec4899",
    highlights: [
      "Built a complete insurance claim processing system on Google Cloud.",
      "Migrated financial models from Anaplan to Google Sheets.",
    ],
    position: [4.5, 0, 0] as [number, number, number],
  },
];

function CameraRig({ activeNode }: { activeNode: number | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const tempDir = useRef(new THREE.Vector3());
  const tempQuat = useRef(new THREE.Quaternion());

  useFrame((_, delta) => {
    try {
      const safeDelta = Math.min(delta, 0.1);

      if (
        activeNode !== null &&
        activeNode >= 0 &&
        activeNode < experiences.length
      ) {
        const nodeX = experiences[activeNode].position[0];
        targetPos.current.set(nodeX, 0, 4);
        targetLook.current.set(nodeX, 0, 0);
      } else {
        targetPos.current.set(0, 0, 9);
        targetLook.current.set(0, 0, 0);
      }

      camera.position.lerp(targetPos.current, safeDelta * 4);

      tempDir.current.subVectors(targetLook.current, camera.position);
      if (tempDir.current.lengthSq() > 0.0001) {
        tempDir.current.normalize();
        tempQuat.current.setFromUnitVectors(
          new THREE.Vector3(0, 0, -1),
          tempDir.current,
        );
        camera.quaternion.slerp(tempQuat.current, safeDelta * 4);
      }
    } catch (error) {
      console.error("CameraRig error:", error);
    }
  });

  return null;
}

function ExperienceNode({
  data,
  index,
  isActive,
  onClick,
  onNext,
  onPrev,
}: {
  data: (typeof experiences)[0];
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isActive ? 0.5 : 0.2);
      meshRef.current.rotation.x += delta * (isActive ? 0.3 : 0.1);
    }
  });

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        onPointerOver={() => {
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
        scale={isActive ? 1.2 : 1}
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={hovered || isActive ? "#ffffff" : data.color}
          wireframe={!(hovered || isActive)}
          emissive={data.color}
          emissiveIntensity={hovered || isActive ? 2 : 0.5}
        />
      </mesh>

      <AnimatePresence>
        {isActive && (
          <Html
            position={[0, 0.9, 0]}
            center
            distanceFactor={6}
            portal={{ current: document.body }}
            style={{ pointerEvents: "auto", userSelect: "none", zIndex: 100 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-3 text-white shadow-2xl w-64"
              style={{ borderLeft: `4px solid ${data.color}` }}
            >
              <h3
                className="text-lg font-bold mb-0.5"
                style={{ color: data.color }}
              >
                {data.company}
              </h3>
              <p className="text-xs text-slate-300">{data.role}</p>
              <p className="text-xs text-slate-400 mb-2">{data.date}</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-200 mb-2 max-h-32 overflow-y-auto">
                {data.highlights.map((h, i) => (
                  <li key={i} className="leading-tight">
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev?.();
                  }}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm"
                  aria-label="Previous"
                >
                  ←
                </button>
                <span className="text-xs text-slate-400">
                  {index + 1} / {experiences.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext?.();
                  }}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm"
                  aria-label="Next"
                >
                  →
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(-1);
                }}
                className="absolute top-1 right-2 text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
    </group>
  );
}

export default function ExperienceTimeline({
  activeNode,
  setActiveNode,
}: {
  activeNode: number | null;
  setActiveNode: (index: number | null) => void;
}) {
  const handlePrev = () => {
    if (activeNode === null) return;
    const prev = (activeNode - 1 + experiences.length) % experiences.length;
    setActiveNode(prev);
  };

  const handleNext = () => {
    if (activeNode === null) return;
    const next = (activeNode + 1) % experiences.length;
    setActiveNode(next);
  };

  return (
    <group onPointerMissed={() => setActiveNode(null)}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CameraRig activeNode={activeNode} />

      {experiences.map((exp, index) => (
        <ExperienceNode
          key={index}
          index={index}
          data={exp}
          isActive={activeNode === index}
          onClick={(idx) => {
            if (idx === -1) setActiveNode(null);
            else setActiveNode(idx);
          }}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ))}
    </group>
  );
}
