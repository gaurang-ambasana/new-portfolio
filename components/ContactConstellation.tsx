"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ContactConstellation() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const primaryLightRef = useRef<THREE.PointLight>(null);
  const secondaryLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (
      !groupRef.current ||
      !planetRef.current ||
      !outerRingRef.current ||
      !innerRingRef.current ||
      !primaryLightRef.current ||
      !secondaryLightRef.current
    )
      return;

    const visible = THREE.MathUtils.smoothstep(scroll.offset, 0.82, 0.94);
    const settle = THREE.MathUtils.smoothstep(scroll.offset, 0.8, 0.92);

    groupRef.current.position.y = THREE.MathUtils.lerp(2.8, 0.2, visible);
    groupRef.current.position.z = THREE.MathUtils.lerp(6.8, 0, visible);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(0.18, 0, visible);
    groupRef.current.scale.setScalar(Math.max(0.001, visible));
    primaryLightRef.current.intensity = 6.5 * visible;
    secondaryLightRef.current.intensity = 4.2 * visible;

    planetRef.current.rotation.y += 0.0035;
    planetRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    planetRef.current.scale.setScalar(0.92 + settle * 0.08);

    outerRingRef.current.rotation.z += 0.0025;
    outerRingRef.current.rotation.x =
      Math.PI / 2.15 + Math.sin(state.clock.elapsedTime * 0.22) * 0.06;
    innerRingRef.current.rotation.z -= 0.0018;
    innerRingRef.current.rotation.x =
      Math.PI / 2.45 + Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, 2.8, 6.8]} scale={0.001}>
      <pointLight
        ref={primaryLightRef}
        position={[0, 1.5, 4]}
        intensity={0}
        color="#60a5fa"
      />
      <pointLight
        ref={secondaryLightRef}
        position={[0, -1.8, 2.5]}
        intensity={0}
        color="#a78bfa"
      />

      <mesh ref={planetRef} position={[0, -0.2, -1.2]}>
        <sphereGeometry args={[2.25, 64, 64]} />
        <meshPhysicalMaterial
          color="#081226"
          emissive="#0f2c59"
          emissiveIntensity={0.42}
          metalness={0.18}
          roughness={0.56}
          clearcoat={0.65}
          clearcoatRoughness={0.22}
        />
      </mesh>

      <mesh ref={outerRingRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[4.8, 0.05, 20, 140]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#93c5fd"
          emissiveIntensity={0.34}
          transparent
          opacity={0.42}
        />
      </mesh>

      <mesh ref={innerRingRef} rotation={[Math.PI / 2.5, 0.6, 0]}>
        <torusGeometry args={[3.1, 0.04, 20, 120]} />
        <meshStandardMaterial
          color="#e9d5ff"
          emissive="#e9d5ff"
          emissiveIntensity={0.28}
          transparent
          opacity={0.36}
        />
      </mesh>
    </group>
  );
}
