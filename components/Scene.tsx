"use client";

import { Canvas } from "@react-three/fiber";
import NeuralMesh from "./NeuralMesh";
import ExperienceTimeline from "./ExperienceNodes";

export default function Scene({
  activeNode,
  setActiveNode,
}: {
  activeNode: number | null;
  setActiveNode: (index: number | null) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
      <NeuralMesh />
      <ExperienceTimeline
        activeNode={activeNode}
        setActiveNode={setActiveNode}
      />
    </Canvas>
  );
}
