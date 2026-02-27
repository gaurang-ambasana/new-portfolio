"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useScroll } from "@react-three/drei";
import * as THREE from "three";

export const experiences = [
  { company: "GRAIXL OÜ", pos: [-4.5, -1, 0], color: "#6366f1", position: "Full Stack Developer" },
  { company: "Tailorbird Inc", pos: [-1.5, -1, 0], color: "#14b8a6", position: "Software Engineer" },
  { company: "Wipro", pos: [1.5, -1, 0], color: "#f59e0b", position: "Software Engineer" },
  { company: "Searce Inc", pos: [4.5, -1, 0], color: "#ec4899", position: "Intern + Work Transformation Analyst" },
];

function ExperienceNode({ data, index, isActive, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const scroll = useScroll();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && textRef.current) {
      // 1. Calculate Visibility based on scroll offset
      // Nodes start appearing after 10% scroll and are fully solid at 40%
      const visibility = THREE.MathUtils.smoothstep(scroll.offset, 0.1, 0.4);

      // 2. Animate Mesh (Diamond)
      meshRef.current.rotation.y += delta * 0.4;

      // Scale is 0 at home, grows to full size on scroll
      const baseScale = visibility;
      const interactionScale = isActive ? 1.4 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3().setScalar(baseScale * interactionScale),
        0.1,
      );

      // Update material opacity (requires transparent: true on material)
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity = visibility;
      }

      // 3. Animate Text (Company Name)
      textRef.current.fillOpacity = visibility;
    }
  });

  return (
    <group position={data.pos as [number, number, number]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          // Only allow clicking if the node is actually visible
          if (scroll.offset > 0.2) {
            e.stopPropagation();
            onClick({ index, x: e.clientX, y: e.clientY });
          }
        }}
        onPointerOver={() => {
          if (scroll.offset > 0.2) setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={data.color}
          transparent // Crucial for fading
          opacity={0}
          wireframe={!hovered && !isActive}
          emissive={data.color}
          emissiveIntensity={isActive ? 8 : 2}
        />
      </mesh>

      <Text
        ref={textRef}
        position={[0, -1.2, 0]}
        fontSize={0.35}
        color="white"
        anchorY="top"
        fillOpacity={0}
      >
        {data.company}
      </Text>
    </group>
  );
}

export default function ExperienceTimeline({ activeNode, setActiveNode }: any) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 11));

  useFrame((_, delta) => {
    if (activeNode !== null) {
      const [x, y] = experiences[activeNode].pos;
      targetPos.current.set(x, y + 0.5, 4.5);
    } else {
      targetPos.current.set(0, 0, 11);
    }
    camera.position.lerp(targetPos.current, delta * 2);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      {experiences.map((exp, i) => (
        <ExperienceNode
          key={i}
          index={i}
          data={exp}
          isActive={activeNode === i}
          onClick={setActiveNode}
        />
      ))}
    </group>
  );
}
