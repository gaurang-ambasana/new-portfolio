"use client";

import { Suspense, useRef } from "react";
import { Float, Cloud, Text, useScroll, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const cloudData = [
  {
    title: "AI & ML",
    skills: "LLM Integration • OpenAI • Groq • Deepseek-R1",
    pos: [-8.5, 4.5, -5],
    color: "818cf8",
    icons: ["simple-icons:openai", "bxl:deepseek", "bxl:groq-ai"],
  },
  {
    title: "Languages",
    skills: "TypeScript • JavaScript • Python",
    pos: [-7.5, -3.5, -4],
    color: "6366f1",
    icons: ["devicon:typescript", "devicon:javascript", "devicon:python"],
  },
  {
    title: "Frontend",
    skills: "Next.js • React • Tailwind • Zustand • Redux",
    pos: [8.5, 5, -6],
    color: "22d3ee",
    icons: [
      "logos:nextjs-icon",
      "logos:react",
      "logos:tailwindcss-icon",
      "devicon:zustand",
      "devicon:redux",
    ],
  },
  {
    title: "Backend",
    skills: "Node.js • FastAPI • GraphQL • PostgreSQL • Redis",
    pos: [7.5, -4.5, -5],
    color: "34d399",
    icons: [
      "logos:nodejs-icon",
      "logos:mysql",
      "logos:graphql",
      "logos:postgresql",
      "devicon:redis",
    ],
  },
  {
    title: "Cloud & Tools",
    skills: "AWS • Google Cloud • Docker • LiveKit • Git",
    pos: [0, 5, -8],
    color: "f472b6",
    icons: [
      "skill-icons:aws-light",
      "simple-icons:livekit",
      "logos:docker-icon",
      "devicon:git",
    ],
  },
];

export default function SkillClouds({ isVisible }: { isVisible: boolean }) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const offset = scroll.offset;
      groupRef.current.position.z = -offset * 5;
      groupRef.current.children.forEach((child) => {
        child.scale.setScalar(Math.max(0.001, 1 - offset * 3.5));
      });
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef}>
      {cloudData.map((cat, i) => (
        <group key={i} position={cat.pos as [number, number, number]}>
          <Float speed={1.2} floatIntensity={0.8}>
            <Cloud
              opacity={0.08}
              bounds={[4, 1.5, 1]}
              volume={2}
              color={`#${cat.color}`}
            />

            <Text
              position={[0, 1.5, 0]}
              fontSize={0.6}
              color={`#${cat.color}`}
              fontWeight="bold"
            >
              {cat.title}
            </Text>

            <Suspense fallback={null}>
              <group position={[0, 0.6, 0]}>
                {cat.icons.map((iconPath, index) => (
                  <Image
                    key={iconPath}
                    // Iconify API: Reliable and highly customizable
                    url={`https://api.iconify.design/${iconPath}.svg?color=%23${cat.color}&width=80&height=80`}
                    transparent
                    scale={0.45}
                    position={[
                      (index - (cat.icons.length - 1) / 2) * 0.7,
                      0,
                      0,
                    ]}
                  />
                ))}
              </group>
            </Suspense>

            <Text
              position={[0, -0.2, 0]}
              fontSize={0.22}
              color="#94a3b8"
              maxWidth={4}
              textAlign="center"
            >
              {cat.skills}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  );
}
