"use client";

import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import { useEffect } from "react";
import NeuralMesh from "./NeuralMesh";
import ExperienceTimeline from "./ExperienceNodes";
import ExperienceOverlay from "./ExperienceOverlay";
import SkillClouds from "./SkillsCloud";

function ScrollTracker({
  onScrollChange,
}: {
  onScrollChange: (val: boolean) => void;
}) {
  const scroll = useScroll();
  useEffect(() => {
    const checkScroll = () => {
      // Small threshold to trigger the fade out
      onScrollChange(scroll.offset > 0.02);
    };
    const interval = setInterval(checkScroll, 50);
    return () => clearInterval(interval);
  }, [scroll, onScrollChange]);
  return null;
}

function Scene({ activeNode, setActiveNode, onScrollChange }: any) {
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 50 }}
        // Optimization: Stop capturing events if a detail card is open
        className={activeNode ? "pointer-events-none" : "pointer-events-auto"}
      >
        <ScrollControls pages={2} damping={0.25}>
          <ScrollTracker onScrollChange={onScrollChange} />

          <NeuralMesh activeNode={activeNode?.index ?? null} />
          <SkillClouds isVisible={activeNode === null} />

          <ExperienceTimeline
            activeNode={activeNode?.index ?? null}
            setActiveNode={setActiveNode}
          />
        </ScrollControls>
      </Canvas>

      <ExperienceOverlay
        activeNode={activeNode}
        setActiveNode={setActiveNode}
      />
    </div>
  );
}

/**
 * THE PERFORMANCE FIX:
 * We use React.memo and tell it to ONLY re-render if
 * activeNode or its inner index changes.
 * This ignores the 'currentText' state updates from the parent.
 */
export default memo(Scene, (prev, next) => {
  return (
    prev.activeNode?.index === next.activeNode?.index &&
    prev.activeNode === next.activeNode
  );
});
