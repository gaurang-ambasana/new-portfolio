"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

export default function NeuralMesh({
  activeNode,
}: {
  activeNode: number | null;
}) {
  const ref = useRef<THREE.Points>(null);
  const materialRef = useRef<any>(null);
  const surge = useRef(0);

  useEffect(() => {
    surge.current = 1.5;
  }, [activeNode]);

  const sphere = useMemo(
    () => random.inSphere(new Float32Array(30000), { radius: 8 }),
    [],
  );

  useFrame((state, delta) => {
    if (ref.current && materialRef.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;

      surge.current = THREE.MathUtils.lerp(surge.current, 0, 0.05);

      const pulseScale = 1 + surge.current * 0.1;
      ref.current.scale.setScalar(pulseScale);
      materialRef.current.opacity = 0.4 + surge.current * 0.4;
      materialRef.current.size = 0.015 + surge.current * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          ref={materialRef}
          transparent
          color="#818cf8"
          size={0.02}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
