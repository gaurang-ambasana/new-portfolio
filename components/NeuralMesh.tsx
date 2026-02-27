"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

export default function NeuralMesh() {
  const ref = useRef<any>(null);

  const sphere = useMemo(
    () => random.inSphere(new Float32Array(15000), { radius: 5 }), // larger radius to surround nodes
    [],
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.01}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
