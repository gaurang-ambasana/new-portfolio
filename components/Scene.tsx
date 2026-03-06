"use client";

import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import { useEffect } from "react";
import NeuralMesh from "./NeuralMesh";
import ExperienceTimeline from "./ExperienceNodes";
import ExperienceOverlay from "./ExperienceOverlay";
import SkillClouds from "./SkillsCloud";
import ProjectGallery from "./ProjectGallery";

function ScrollTracker({
  onScrollChange,
}: {
  onScrollChange: (state: {
    isScrolled: boolean;
    isPastExperience: boolean;
  }) => void;
}) {
  const scroll = useScroll();
  useEffect(() => {
    const checkScroll = () => {
      onScrollChange({
        isScrolled: scroll.offset > 0.05,
        isPastExperience: scroll.offset > 0.55,
      });
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
        className={activeNode ? "pointer-events-none" : "pointer-events-auto"}
      >
        <ScrollControls pages={3} damping={0.25}>
          <ScrollTracker onScrollChange={onScrollChange} />

          <NeuralMesh activeNode={activeNode?.index ?? null} />
          <SkillClouds isVisible={activeNode === null} />
          <ExperienceTimeline
            activeNode={activeNode?.index ?? null}
            setActiveNode={setActiveNode}
          />
          <ProjectGallery />
        </ScrollControls>
      </Canvas>
      <ExperienceOverlay
        activeNode={activeNode}
        setActiveNode={setActiveNode}
      />
    </div>
  );
}

export default memo(Scene, (prev, next) => {
  return (
    prev.activeNode?.index === next.activeNode?.index &&
    prev.activeNode === next.activeNode
  );
});
