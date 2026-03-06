"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useScroll, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const projectData = [
  {
    title: "AI Code Reviewer",
    tech: "NEXT.JS • GROQ LLAMA-3",
    description:
      "Intelligent feedback for multi-language code snippets using advanced LLM orchestration.",
    color: "#818cf8", // Indigo
    link: "https://ai-code-reviewer-seven-snowy.vercel.app/",
  },
  {
    title: "MERN eCommerce",
    tech: "MONGODB • REACT • NODE.JS",
    description:
      "Complete full-stack platform with dynamic admin/consumer auth and RESTful APIs.",
    color: "#34d399", // Emerald
    link: "https://github.com/gaurang-ambasana/MERN-eCommerce",
  },
  {
    title: "Flow Chart Builder",
    tech: "NEXT.JS • REACT FLOW",
    description:
      "Interactive node-based canvas featuring custom shapes and live schema validation.",
    color: "#22d3ee", // Cyan
    link: "https://flow-chart-builder-six.vercel.app/",
  },
  {
    title: "2048 Clone",
    tech: "VANILLA JAVASCRIPT",
    description:
      "Browser-based game clone featuring smooth animations and mobile-responsive support.",
    color: "#f472b6", // Pink
    link: "https://2048-clone-three.vercel.app/",
  },
];

function ProjectCard({ project, index, count }: any) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Gallery Layout Constants
  const spacing = 3.6;

  useFrame((state, delta) => {
    if (groupRef.current && contentRef.current) {
      const start = 0.65;
      const end = 0.95;
      const scrollOpacity = THREE.MathUtils.smoothstep(scroll.offset, start, end);

      const offset = index - (count - 1) / 2;
      const t = hovered ? 0.15 : 0.08;

      const targetX = offset * spacing;
      const targetY = scrollOpacity < 0.1 ? -15 : hovered ? 0.2 : 0; // Reduced vertical jump
      
      // THE FIX: Changed hovered Z from 3.5 to 1.0 (Much more subtle zoom)
      // Also reduced the resting push-back from 1.5 to 0.8
      const targetZ = hovered ? 1.0 : -Math.abs(offset) * 0.8; 
      
      // Reduced the resting angle so the cards are easier to read before hovering
      const targetRotY = hovered ? 0 : -offset * 0.15; 
      const targetRotZ = hovered ? 0 : -offset * 0.02;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, t);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, t);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, t);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, t);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, t);

      // Keep the text parallax subtle too
      contentRef.current.position.z = THREE.MathUtils.lerp(contentRef.current.position.z, hovered ? 0.25 : 0.15, t);

      groupRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, scrollOpacity, 0.1);
          child.material.transparent = true;
        }
      });
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
        rotationIntensity={hovered ? 0.05 : 0.2}
        floatIntensity={0.5}
      >
        {/* 1. The Physical Card Base (Premium Acrylic Look) */}
        <RoundedBox args={[3.4, 4.8, 0.15]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial
            color="#020617"
            metalness={0.9}
            roughness={0.2}
            clearcoat={1.0} // Gives it a high-end glossy reflection
            clearcoatRoughness={0.1}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.4 : 0.02}
          />
        </RoundedBox>

        {/* 2. The Ambient "Aura" behind the card */}
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[3.8, 5.2]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.15 : 0}
          />
        </mesh>

        {/* 3. The Content (Wrapped in a ref for Z-axis Parallax) */}
        <group ref={contentRef}>
          {/* Accent Line */}
          <mesh position={[0, 1.9, 0]}>
            <planeGeometry args={[2.8, 0.02]} />
            <meshBasicMaterial color={project.color} />
          </mesh>

          <Text
            position={[-1.4, 1.6, 0]}
            fontSize={0.25}
            color="#ffffff"
            fontWeight="900"
            anchorX="left"
          >
            {project.title.toUpperCase()}
          </Text>

          <Text
            position={[-1.4, 1.2, 0]}
            fontSize={0.11}
            color={project.color}
            fontWeight="bold"
            letterSpacing={0.15}
            anchorX="left"
          >
            {project.tech}
          </Text>

          <Text
            position={[-1.4, 0.2, 0]}
            fontSize={0.16}
            color="#94a3b8"
            maxWidth={2.8}
            lineHeight={1.6}
            anchorX="left"
            anchorY="top"
          >
            {project.description}
          </Text>

          {/* Interactive Holographic Button */}
          <group
            position={[0, -1.6, 0]}
            onClick={() => window.open(project.link, "_blank")}
          >
            <RoundedBox args={[2.8, 0.6, 0.05]} radius={0.05}>
              <meshStandardMaterial
                color={hovered ? project.color : "#0f172a"}
                metalness={0.5}
                roughness={0.2}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.14}
              color={hovered ? "#fff" : project.color}
              fontWeight="900"
              letterSpacing={0.1}
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
    <group position={[0, -1.5, 0]}>
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
