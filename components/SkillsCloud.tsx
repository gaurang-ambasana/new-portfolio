"use client";

import { Suspense, useMemo, useRef } from "react";
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

function CloudCluster({
  cat,
  index,
  offset,
}: {
  cat: (typeof cloudData)[number];
  index: number;
  offset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const base = useMemo(
    () => new THREE.Vector3(cat.pos[0], cat.pos[1], cat.pos[2]),
    [cat.pos],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const visible = 1 - THREE.MathUtils.smoothstep(offset, 0.13, 0.24);
    const orbit = THREE.MathUtils.smoothstep(offset, 0, 0.16);
    const angle = state.clock.elapsedTime * 0.12 + index * 1.24;
    const orbitRadius = 1.2 + index * 0.18;

    groupRef.current.position.x =
      base.x + Math.cos(angle) * orbitRadius * orbit;
    groupRef.current.position.y =
      base.y + Math.sin(angle * 1.2) * 0.7 - orbit * 0.7;
    groupRef.current.position.z = base.z + Math.sin(angle) * 0.9 - offset * 2.5;
    groupRef.current.rotation.y = Math.sin(angle) * 0.28;
    groupRef.current.rotation.z = Math.cos(angle * 0.8) * 0.08;
    groupRef.current.scale.setScalar(Math.max(0.001, visible));
    groupRef.current.visible = visible > 0.02;
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.2 + index * 0.08}
        floatIntensity={0.8}
        rotationIntensity={0.08}
      >
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
            {cat.icons.map((iconPath, iconIndex) => (
              <Image
                key={iconPath}
                url={`https://api.iconify.design/${iconPath}.svg?color=%23${cat.color}&width=80&height=80`}
                transparent
                scale={0.45}
                position={[
                  (iconIndex - (cat.icons.length - 1) / 2) * 0.7,
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
  );
}

export default function SkillClouds({ isVisible }: { isVisible: boolean }) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const offset = scroll.offset;
      const introVisible = 1 - THREE.MathUtils.smoothstep(offset, 0.12, 0.24);
      groupRef.current.position.z = -offset * 6;
      groupRef.current.position.y = THREE.MathUtils.lerp(0, -0.8, offset);
      groupRef.current.rotation.y = offset * 0.45;
      groupRef.current.scale.setScalar(Math.max(0.001, introVisible));
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef}>
      {cloudData.map((cat, i) => (
        <CloudCluster key={i} cat={cat} index={i} offset={scroll.offset} />
      ))}
    </group>
  );
}
