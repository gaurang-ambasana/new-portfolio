"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useScroll } from "@react-three/drei";
import * as THREE from "three";

export const experiences = [
  {
    company: "GRAIXL OÜ",
    pos: [-4.5, -1, 0],
    color: "#6366f1",
    position: "Full Stack Developer",
  },
  {
    company: "Tailorbird Inc",
    pos: [-1.5, -1, 0],
    color: "#14b8a6",
    position: "Software Engineer",
  },
  {
    company: "Wipro",
    pos: [1.5, -1, 0],
    color: "#f59e0b",
    position: "Software Engineer",
  },
  {
    company: "Searce Inc",
    pos: [4.5, -1, 0],
    color: "#ec4899",
    position: "Intern + Work Transformation Analyst",
  },
];

function ExperienceNode({ data, index, isActive, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const [hovered, setHover] = useState(false);
  const basePos = useMemo(
    () => new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2]),
    [data.pos],
  );

  useFrame((state, delta) => {
    if (meshRef.current && textRef.current && groupRef.current) {
      const fadeIn = THREE.MathUtils.smoothstep(
        scroll.offset,
        0.16 + index * 0.025,
        0.26 + index * 0.025,
      );
      const fadeOut = 1 - THREE.MathUtils.smoothstep(scroll.offset, 0.5, 0.6);
      const totalVisibility = fadeIn * fadeOut;
      const bob = Math.sin(state.clock.elapsedTime * 1.15 + index * 0.9) * 0.14;
      const entranceX = THREE.MathUtils.lerp(
        basePos.x + Math.sign(basePos.x || 1) * 2.2,
        basePos.x,
        fadeIn,
      );
      const entranceY =
        THREE.MathUtils.lerp(basePos.y - 2.5, basePos.y, fadeIn) + bob;
      const entranceZ = THREE.MathUtils.lerp(-2.8, basePos.z, fadeIn);

      groupRef.current.position.set(entranceX, entranceY, entranceZ);
      groupRef.current.rotation.z =
        (1 - fadeIn) * (Math.sign(basePos.x || 1) * 0.25);

      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime + index) * 0.18;

      const interactionScale = isActive ? 1.4 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3().setScalar(totalVisibility * interactionScale),
        0.1,
      );

      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity = totalVisibility;
        meshRef.current.material.transparent = true;
        meshRef.current.material.emissiveIntensity = isActive
          ? 8
          : hovered
            ? 3.5
            : 2;
      }
      textRef.current.fillOpacity = totalVisibility;
      textRef.current.position.y = -1.2 + (1 - fadeIn) * 0.45;

      meshRef.current.visible = totalVisibility > 0.01;
    }
  });

  return (
    <group ref={groupRef} position={data.pos as [number, number, number]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          if (scroll.offset > 0.2 && scroll.offset < 0.5) {
            e.stopPropagation();
            onClick({ index, x: e.clientX, y: e.clientY });
          }
        }}
        onPointerOver={() => {
          if (scroll.offset > 0.2 && scroll.offset < 0.5) {
            setHover(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={data.color}
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
  const scroll = useScroll();
  const targetPos = useRef(new THREE.Vector3(0, 0, 11));
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (activeNode !== null) {
      const [x, y] = experiences[activeNode].pos;
      targetPos.current.set(x, y + 0.5, 4.5);
    } else {
      const sectionProgress = THREE.MathUtils.clamp(
        (scroll.offset - 0.16) / 0.34,
        0,
        1,
      );
      targetPos.current.set(
        Math.sin(sectionProgress * Math.PI) * 0.6,
        THREE.MathUtils.lerp(1.2, -0.25, sectionProgress),
        THREE.MathUtils.lerp(13, 10.4, sectionProgress),
      );
      if (groupRef.current) {
        groupRef.current.rotation.y =
          Math.sin(sectionProgress * Math.PI) * 0.18;
        groupRef.current.position.y = THREE.MathUtils.lerp(
          0.8,
          0,
          sectionProgress,
        );
      }
    }
    camera.position.lerp(targetPos.current, delta * 2);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
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
