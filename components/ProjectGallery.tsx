"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useScroll, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const projectData = [
  {
    title: "Weather App",
    tech: "REACT",
    description:
      "A simple weather app for checking current conditions in a clean single-page interface.",
    color: "#f59e0b",
    link: "https://weather-app-522.netlify.app/",
  },
  {
    title: "API Tester CLI",
    tech: "JAVASCRIPT, HTML, CSS",
    description:
      "A browser-based API tester with methods, query params, headers, JSON input, and response output.",
    color: "#38bdf8",
    link: "https://api-tester-cli.vercel.app/",
  },
  {
    title: "AI Code Reviewer",
    tech: "NEXT.JS, GROQ AI",
    description:
      "An AI powered code review tool where you paste a snippet, choose a language, and get feedback on code quality.",
    color: "#818cf8",
    link: "https://ai-code-reviewer-seven-snowy.vercel.app/",
  },
  {
    title: "Resume Destroyer",
    tech: "NEXT.JS, GROQ AI",
    description:
      "An AI powered resume review app that accepts a PDF upload and returns direct suggestions for improvement.",
    color: "#34d399",
    link: "https://resume-review-destroyer.vercel.app/",
  },
  {
    title: "Flow Chart Builder",
    tech: "NEXT.JS • REACT FLOW",
    description:
      "A flowchart builder with shape controls, a node canvas, and a live JSON panel for updates.",
    color: "#22d3ee",
    link: "https://flow-chart-builder-six.vercel.app/",
  },
  { 
    title: "2048 Clone",
    tech: "VANILLA JAVASCRIPT",
    description:
      "A browser version of 2048 with keyboard and swipe support for desktop and mobile play.",
    color: "#f472b6",
    link: "https://2048-clone-three.vercel.app/",
  },
];

function ProjectCard({ project, index, count }: any) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const spreadIndex = index - (count - 1) / 2;
  const spacingX = 1.78;
  const arcLift = Math.abs(spreadIndex) * -0.28;
  const restingTiltZ = -spreadIndex * 0.19;
  const restingTiltY = -spreadIndex * 0.1;

  useFrame((state, delta) => {
    if (groupRef.current && contentRef.current) {
      const start = 0.65;
      const end = 0.95;
      const scrollOpacity = THREE.MathUtils.smoothstep(
        scroll.offset,
        start,
        end,
      );
      const t = hovered ? 0.15 : 0.08;

      const targetX =
        spreadIndex * spacingX + (hovered ? spreadIndex * 0.16 : 0);
      const targetY =
        scrollOpacity < 0.1 ? -15 : arcLift + (hovered ? 0.68 : 0);
      const targetZ = hovered ? 1.85 : -Math.abs(spreadIndex) * 0.55;
      const targetRotY = hovered ? 0 : restingTiltY;
      const targetRotZ = hovered ? 0 : restingTiltZ;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        t,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        t,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        t,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        t,
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotZ,
        t,
      );

      contentRef.current.position.z = THREE.MathUtils.lerp(
        contentRef.current.position.z,
        hovered ? 0.3 : 0.14,
        t,
      );

      groupRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity,
            scrollOpacity,
            0.1,
          );
          child.material.transparent = true;
        }
      });

      groupRef.current.renderOrder = hovered ? 200 : 40 - Math.abs(spreadIndex);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    window.dispatchEvent(
      new CustomEvent("projectHover", { detail: { color: project.color } }),
    );
  };

  const handlePointerOut = () => {
    setHovered(false);
    window.dispatchEvent(new CustomEvent("projectUnhover"));
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <Float
        speed={hovered ? 1 : 3}
        rotationIntensity={hovered ? 0.04 : 0.16}
        floatIntensity={0.28}
      >
        <RoundedBox args={[2.58, 4.3, 0.14]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#020617"
            metalness={0.9}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.4 : 0.02}
          />
        </RoundedBox>

        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[3.05, 4.8]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.15 : 0}
          />
        </mesh>

        <group ref={contentRef}>
          <mesh position={[0, 1.76, 0]}>
            <planeGeometry args={[2.08, 0.02]} />
            <meshBasicMaterial color={project.color} />
          </mesh>

          <Text
            position={[-1.03, 1.4, 0]}
            fontSize={0.2}
            color="#ffffff"
            fontWeight="900"
            maxWidth={2.02}
            lineHeight={1}
            anchorX="left"
            anchorY="middle"
          >
            {project.title.toUpperCase()}
          </Text>

          <Text
            position={[-1.03, 0.88, 0]}
            fontSize={0.08}
            color={project.color}
            fontWeight="bold"
            letterSpacing={0.11}
            anchorX="left"
          >
            {project.tech}
          </Text>

          <Text
            position={[-1.03, 0.08, 0]}
            fontSize={0.105}
            color="#94a3b8"
            maxWidth={2.02}
            lineHeight={1.46}
            anchorX="left"
            anchorY="top"
          >
            {project.description}
          </Text>

          <group
            position={[0, -1.42, 0]}
            onClick={() => window.open(project.link, "_blank")}
          >
            <RoundedBox args={[1.9, 0.5, 0.05]} radius={0.05}>
              <meshStandardMaterial
                color={hovered ? project.color : "#0f172a"}
                metalness={0.5}
                roughness={0.2}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.11}
              color={hovered ? "#fff" : project.color}
              fontWeight="900"
              letterSpacing={0.08}
            >
              VIEW PROJECT
            </Text>
          </group>
        </group>
      </Float>
    </group>
  );
}

export default function ProjectGallery() {
  return (
    <group position={[0, -0.82, 0]}>
      {projectData.map((project, i) => (
        <ProjectCard
          key={i}
          project={project}
          index={i}
          count={projectData.length}
        />
      ))}
    </group>
  );
}
