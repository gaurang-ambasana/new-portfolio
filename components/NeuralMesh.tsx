"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, useScroll } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

export default function NeuralMesh({
  activeNode,
}: {
  activeNode: number | null;
}) {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  const surge = useRef(0);
  const scroll = useScroll();

  useEffect(() => {
    surge.current = 1.5;
  }, [activeNode]);

  const sphere = useMemo(
    () => random.inSphere(new Float32Array(30000), { radius: 8 }),
    [],
  );

  useFrame((state, delta) => {
    if (ref.current && materialRef.current && groupRef.current) {
      const offset = scroll.offset;
      const introVisible = 1 - THREE.MathUtils.smoothstep(offset, 0.16, 0.28);
      const tunnelProgress = THREE.MathUtils.smoothstep(offset, 0.02, 0.22);

      groupRef.current.position.z = THREE.MathUtils.lerp(
        0,
        -5.5,
        tunnelProgress,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        0,
        1.2,
        tunnelProgress,
      );
      groupRef.current.rotation.z = Math.PI / 4 + tunnelProgress * 0.75;
      groupRef.current.rotation.x = tunnelProgress * 0.18;

      ref.current.rotation.x -= delta / 18;
      ref.current.rotation.y -= delta / 22;
      ref.current.rotation.z += delta * 0.08;

      surge.current = THREE.MathUtils.lerp(surge.current, 0, 0.05);

      const pulseScale = 1 + surge.current * 0.1 + tunnelProgress * 0.45;
      ref.current.scale.set(
        pulseScale * (1 + tunnelProgress * 0.3),
        pulseScale * (1 - tunnelProgress * 0.18),
        pulseScale * (1 + tunnelProgress * 0.75),
      );
      materialRef.current.opacity = (0.4 + surge.current * 0.4) * introVisible;
      materialRef.current.size =
        (0.015 + surge.current * 0.02) * (1 + tunnelProgress * 0.7);
      ref.current.visible = introVisible > 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
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
